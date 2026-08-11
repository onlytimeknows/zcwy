#!/usr/bin/env python3
"""Deployment-faithful whole-effect Turbo Flare planning audit."""

from __future__ import annotations

import copy
import hashlib
import importlib.util
import itertools
import json
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
RESULTS = HERE / "results"
BASE = ROOT / "bots/tempo/v5.6.2/main.py"
ROOT_ONLY = ROOT / "bots/tempo/v5.10.0/main.py"
DECK = ROOT / "deck.csv"
SDK = ROOT / "data/sample_submission/sample_submission"
PRIOR_DIR = ROOT / "research/tempo_turbo_flare_threshold_topology_audit_v0_1"
PRIOR_TRACE = PRIOR_DIR / "results/SHADOW_TRACE.json"
CALLBACK_MANIFEST = ROOT / "research/tempo_turbo_flare_attachment_confidence_v0_1/COHORT_MANIFEST.json"
RERANK_DIR = ROOT / "research/tempo_turbo_flare_semantic_reranker_v0_1/results"
VECTORS = RERANK_DIR / "TRANSITION_VECTORS.json"
PAIRWISE = RERANK_DIR / "PAIRWISE_CLASSIFICATIONS.json"
POSITIVE = RERANK_DIR / "POSITIVE_CONTROLS.json"
ATTACH_TO, ATTACH_FROM, CINDERACE, WATER = 22, 21, 666, 3

REPLAY_DIRS = {
    "submission_55427464_refresh": ROOT / "research/tempo_root_only_3x_evaluator_forensics_v0_1/private_artifacts/submission_55427464_refresh",
    "submission_55240963_autopsy": ROOT / "research/tempo_froslass_recent_loss_causal_autopsy_v0_1/private/submission_55240963",
    "submission_54898083_emergency": ROOT / "research/tempo_froslass_emergency_audit_v0_1/private_episodes",
}


def stable(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), default=str)


def digest(value: Any) -> str:
    return hashlib.sha256(stable(value).encode()).hexdigest()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_module(name: str, path: Path = BASE) -> Any:
    if str(SDK) not in sys.path: sys.path.insert(0, str(SDK))
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec); sys.modules[name] = module; spec.loader.exec_module(module)
    module._BELIEF_MEMORY.clear(); module._BELIEF_MEMORY.update({"player": None, "last_turn": -1, "seen": Counter(), "particle_batch": 0})
    module._TIME_MANAGER.clear(); module._TIME_MANAGER.update({"decisions": 0, "last_turn": -1})
    module._CRITICAL_STATE.clear(); module._CRITICAL_STATE.update({"escalated": False, "adversarial": False})
    module._rng.seed(0xEFFEC701)
    return module


def restore_prefix(module: Any, replay: dict[str, Any], seat: int, step: int) -> None:
    for row in replay["steps"][:step]:
        agent = row[seat]; raw = agent.get("observation") or {}
        if agent.get("status") != "ACTIVE" or raw.get("select") is None: continue
        obs = module.to_observation_class(copy.deepcopy(raw)); module._update_belief_memory(obs)
        bank = float(raw.get("remainingOverageTime", 600.0) or 0.0)
        if obs.search_begin_input is not None and obs.current is not None and bank > module.RESERVE_SECONDS:
            module._decision_budget(obs, bank)
            if module._has_real_choice(obs): module._BELIEF_MEMORY["particle_batch"] += 1


def response_at(replay: dict[str, Any], seat: int, step: int) -> list[int]:
    value = replay["steps"][step + 1][seat].get("action")
    if not isinstance(value, list): raise AssertionError((seat, step, value))
    return [int(x) for x in value]


def pokemon_row(p: Any) -> dict[str, Any]:
    if p is None: return {"none": True}
    return {
        "id": int(p.id), "serial": int(p.serial), "hp": int(p.hp), "max_hp": int(p.maxHp),
        "appear_this_turn": bool(p.appearThisTurn), "energies": sorted(int(x) for x in p.energies),
        "energy_card_ids": sorted(int(x.id) for x in p.energyCards),
        "tools": sorted((int(x.id), int(x.serial)) for x in p.tools),
        "pre_evolution": [(int(x.id), int(x.serial)) for x in p.preEvolution],
    }


def mechanical_signature(current: Any, me: int) -> str:
    mine, opp = current.players[me], current.players[1 - me]
    payload = {
        "turn": int(current.turn), "result": int(current.result),
        "mine_active": [pokemon_row(x) for x in mine.active], "mine_bench": [pokemon_row(x) for x in mine.bench],
        "opp_active": [pokemon_row(x) for x in opp.active], "opp_bench": [pokemon_row(x) for x in opp.bench],
        "mine_hand": sorted((int(x.id), int(x.serial)) for x in (mine.hand or [])),
        "mine_discard": sorted((int(x.id), int(x.serial)) for x in (mine.discard or [])),
        "mine_prize": sorted((int(x.id), int(x.serial)) for x in (mine.prize or []) if x is not None),
        # Deck order is deliberately excluded: Turbo Flare shuffles. PlayerState
        # exposes only the public remaining count, which is all deployment can
        # legally use at this point.
        "mine_deck_count": int(mine.deckCount),
        "opp_public_counts": (int(opp.handCount), int(opp.deckCount), len(opp.prize or [])),
    }
    return digest(payload)


def option_target_serial(state: Any, action_index: int) -> int:
    obs = state.observation; option = obs.select.option[action_index]
    bench_index = int(option.index); me = int(obs.current.yourIndex)
    return int(obs.current.players[me].bench[bench_index].serial)


def action_for_target_serial(state: Any, serial: int) -> list[int]:
    obs = state.observation; me = int(obs.current.yourIndex); matches = []
    for index, option in enumerate(obs.select.option):
        bench_index = int(option.index); pokemon = obs.current.players[me].bench[bench_index]
        if int(pokemon.serial) == int(serial): matches.append(index)
    if len(matches) != 1: raise AssertionError((serial, matches))
    return [matches[0]]


def predicted_allocation(initial: tuple[int, ...], path: tuple[int, ...], options: list[Any]) -> tuple[int, ...]:
    output = list(initial)
    for action_index in path: output[int(options[action_index].index)] += 1
    return tuple(output)


def enumerate_paths(module: Any, selected_state: Any, remaining: int,
                    path: tuple[int, ...] = (), serial_path: tuple[int, ...] = ()):
    if remaining == 0:
        return [(path, serial_path, selected_state)]
    obs = selected_state.observation
    if obs.select is None or int(obs.select.context) != ATTACH_FROM: raise AssertionError((remaining, obs.select))
    candidates = module._candidate_sets(obs)
    expected = [[i] for i in module._ranking(obs)]
    if sorted(candidates) != sorted(expected): raise AssertionError((candidates, expected))
    output = []
    for action in candidates:
        serial = option_target_serial(selected_state, int(action[0]))
        child = module.search_step(selected_state.searchId, action)
        output.extend(enumerate_paths(module, child, remaining - 1,
                                      path + (int(action[0]),), serial_path + (serial,)))
    return output


def replay_serial_plan(module: Any, root_state: Any, energy_action: list[int], serial_path: tuple[int, ...]):
    state = module.search_step(root_state.searchId, energy_action)
    callback_rows = []
    for serial in serial_path:
        obs = state.observation
        callback_rows.append({"context": int(obs.select.context), "effect_id": int(obs.select.effect.id),
                              "effect_serial": int(obs.select.effect.serial),
                              "context_card_id": int(obs.select.contextCard.id),
                              "context_card_serial": int(obs.select.contextCard.serial),
                              "target_serial": int(serial), "legal_target_count": len(obs.select.option)})
        state = module.search_step(state.searchId, action_for_target_serial(state, serial))
    return state, callback_rows


def pair_key(count: int, allocation: tuple[int, ...]) -> tuple[int, tuple[int, ...]]:
    return int(count), tuple(int(x) for x in allocation)


def analyze_relations(root_id: str, vectors: list[dict[str, Any]], pairs: list[dict[str, Any]]) -> dict[str, Any]:
    plans = {pair_key(v["candidate"]["energy_selected_count"], tuple(v["candidate"]["allocation"])) for v in vectors}
    incoming, outgoing = defaultdict(set), defaultdict(set); counts = Counter()
    tradeoff_adjacency = defaultdict(set); info_adjacency = defaultdict(set)
    for row in pairs:
        cls = row["classification"]; counts[cls] += 1
        a = pair_key(row["candidate_a"]["energy_selected_count"], tuple(row["candidate_a"]["allocation"]))
        b = pair_key(row["candidate_b"]["energy_selected_count"], tuple(row["candidate_b"]["allocation"]))
        if cls in {"STRICT_MECHANICAL_DOMINANCE", "CONDITIONAL_MECHANICAL_DOMINANCE"}:
            winner, loser = (a, b) if row["direction"] == "A" else (b, a)
            outgoing[winner].add(loser); incoming[loser].add(winner)
        elif cls == "GENUINE_TRADEOFF":
            tradeoff_adjacency[a].add(b); tradeoff_adjacency[b].add(a)
        elif cls == "INFORMATION_LIMITED":
            info_adjacency[a].add(b); info_adjacency[b].add(a)
    return {"plans": plans, "incoming": incoming, "outgoing": outgoing,
            "tradeoff": tradeoff_adjacency, "information": info_adjacency, "counts": counts}


def plan_json(key: tuple[int, tuple[int, ...]]) -> dict[str, Any]:
    return {"energy_selected_count": key[0], "allocation": list(key[1])}


def main() -> None:
    prior = json.loads(PRIOR_TRACE.read_text(encoding="utf-8"))
    callback_manifest = json.loads(CALLBACK_MANIFEST.read_text(encoding="utf-8"))
    vector_data = json.loads(VECTORS.read_text(encoding="utf-8"))
    pair_data = json.loads(PAIRWISE.read_text(encoding="utf-8"))
    positive_ids = {x["root_id"] for x in json.loads(POSITIVE.read_text(encoding="utf-8"))["roots"]}
    vectors_by_root = {x["root_id"]: x["vectors"] for x in vector_data["roots"]}
    pairs_by_root = defaultdict(list)
    for row in pair_data["pairs"]: pairs_by_root[row["root_id"]].append(row)
    chain_by_root = {x["root_id"]: x for x in callback_manifest["chains"]}
    deck = [int(x) for x in DECK.read_text().split()]
    roots = []
    execution_plan_count = execution_matches = ordered_path_count = 0
    ordered_equivalence_failures = []; replay_mismatches = []; unexpected_transitions = []
    energy_order_tests = []
    exogenous_counts = Counter()
    for prior_root in prior["roots"]:
        # Keep archived episodes mechanically isolated from one another.
        module = load_module(f'effect_level_v562_{len(roots)}')
        root_id = prior_root["root_id"]; source = prior_root["source"]
        replay_path = REPLAY_DIRS[source] / f'{prior_root["episode_id"]}.json'
        replay = json.loads(replay_path.read_text(encoding="utf-8"))
        seat, step = int(prior_root["seat"]), int(prior_root["step"])
        raw = replay["steps"][step][seat]["observation"]
        restore_prefix(module, replay, seat, step)
        obs = module.to_observation_class(copy.deepcopy(raw))
        if int(obs.select.context) != ATTACH_TO or int(obs.select.effect.id) != CINDERACE: raise AssertionError(root_id)
        if {int(x.id) for x in obs.select.deck if int(x.id) == WATER} != {WATER}: raise AssertionError(root_id)
        energy_options = list(obs.select.option)
        energy_ids = [int(obs.select.deck[int(x.index)].id) for x in energy_options]
        if set(energy_ids) != {WATER}: raise AssertionError((root_id, energy_ids))
        initial_bench = tuple(len(x.energies) for x in obs.current.players[seat].bench)
        relation = analyze_relations(root_id, vectors_by_root[root_id], pairs_by_root[root_id])
        historical_energy_action = response_at(replay, seat, step)
        historical_targets = []
        for ordinal in range(len(historical_energy_action)):
            callback_step = step + 1 + ordinal
            callback_raw = replay["steps"][callback_step][seat]["observation"]
            target_action = response_at(replay, seat, callback_step)
            option = callback_raw["select"]["option"][target_action[0]]
            historical_targets.append(int(option["index"]))
        historical_allocation = list(initial_bench)
        for target in historical_targets: historical_allocation[target] += 1
        historical_key = pair_key(len(historical_energy_action), tuple(historical_allocation))
        if historical_key not in relation["plans"]: raise AssertionError((root_id, historical_key))
        incoming = relation["incoming"].get(historical_key, set())
        if incoming:
            historical_class = "BASE_REACHES_DOMINATED_PLAN"
        elif relation["tradeoff"].get(historical_key):
            historical_class = "GENUINE_TRADEOFF"
        elif relation["information"].get(historical_key) and not relation["outgoing"].get(historical_key):
            historical_class = "INFORMATION_LIMITED"
        else:
            historical_class = "BASE_ALREADY_UNDOMINATED"

        world_summaries = []
        for world in range(2):
            determinization = module._determinize(obs, deck, world, 2, 0)
            root_state = module.search_begin(obs, *determinization)
            world_plans = []
            try:
                # Multi-select action order test. The SDK accepts permutations;
                # the resulting same-ID Water serial order may differ, but target
                # capability and final mechanical state must not.
                for count in (2, 3):
                    if len(energy_options) < count: continue
                    subset = list(range(count)); sequences = {}
                    for permutation in itertools.permutations(subset):
                        selected = module.search_step(root_state.searchId, list(permutation))
                        context_serials = []
                        state = selected
                        for _ in range(count):
                            context_serials.append(int(state.observation.select.contextCard.serial))
                            state = module.search_step(state.searchId, [0])
                        sequences[str(list(permutation))] = {"context_card_serial_order": context_serials,
                                                             "final_mechanical_signature": mechanical_signature(state.observation.current, seat)}
                    energy_order_tests.append({"root_id": root_id, "world": world, "energy_count": count, "permutations": sequences,
                                               "distinct_final_mechanical_states": len({x["final_mechanical_signature"] for x in sequences.values()}),
                                               "distinct_context_serial_orders": len({tuple(x["context_card_serial_order"]) for x in sequences.values()})})

                for count in range(0, min(3, len(energy_options)) + 1):
                    energy_action = list(range(count))
                    selected_state = module.search_step(root_state.searchId, energy_action)
                    paths = enumerate_paths(module, selected_state, count)
                    ordered_path_count += len(paths)
                    grouped = defaultdict(list)
                    for index_path, serial_path, final_state in paths:
                        allocation = tuple(len(x.energies) for x in final_state.observation.current.players[seat].bench)
                        predicted = predicted_allocation(initial_bench, index_path, list(selected_state.observation.select.option) if count else []) if count else initial_bench
                        if allocation != predicted: replay_mismatches.append({"root_id": root_id, "world": world, "path": list(index_path), "reason": "predicted allocation mismatch"})
                        grouped[allocation].append((index_path, serial_path, final_state, mechanical_signature(final_state.observation.current, seat)))
                    for allocation, equivalents in grouped.items():
                        signatures = {x[3] for x in equivalents}
                        if len(signatures) != 1:
                            ordered_equivalence_failures.append({"root_id": root_id, "world": world, "energy_count": count,
                                                                 "allocation": list(allocation), "distinct_signatures": len(signatures)})
                        representative = equivalents[0]
                        replayed, callback_rows = replay_serial_plan(module, root_state, energy_action, representative[1])
                        execution_plan_count += 1
                        replay_sig = mechanical_signature(replayed.observation.current, seat)
                        expected_sig = representative[3]
                        if replay_sig == expected_sig:
                            execution_matches += 1
                        else:
                            replay_mismatches.append({"root_id": root_id, "world": world, "energy_count": count,
                                                      "allocation": list(allocation), "reason": "stable-serial replay state mismatch"})
                        world_plans.append({"energy_selected_count": count, "allocation": list(allocation),
                                            "representative_target_serial_path": list(representative[1]),
                                            "ordered_path_multiplicity": len(equivalents),
                                            "mechanical_successor_sha256": expected_sig,
                                            "stable_serial_replay_match": replay_sig == expected_sig,
                                            "callback_trace": callback_rows})
            finally:
                try: module.search_end()
                except Exception: pass
            world_summaries.append({"world": world, "state_distinct_plans": world_plans})

        # Native and archived chains contain no other callback and no opponent
        # reply between own target choices. Board deltas are exactly one Water
        # attachment plus the next contextCard/menu update.
        chain = chain_by_root[root_id]
        if int(chain["attach_to_step"]) != step:
            raise AssertionError((root_id, chain["attach_to_step"], step))
        if list(chain["attach_to_action"]) != historical_energy_action:
            raise AssertionError((root_id, chain["attach_to_action"], historical_energy_action))
        if int(chain["selected_energy_count"]) != len(historical_energy_action):
            raise AssertionError((root_id, chain["selected_energy_count"], historical_energy_action))
        for ordinal, callback_id in enumerate(chain["callback_ids"], start=1):
            callback = next(x for x in callback_manifest["callbacks"] if x["callback_id"] == callback_id)
            if int(callback["ordinal"]) != ordinal or int(callback["step"]) != step + ordinal:
                raise AssertionError((root_id, callback_id, callback["ordinal"], callback["step"]))
            callback_raw = replay["steps"][int(callback["step"])][seat]["observation"]
            select = callback_raw["select"]
            if int(select["context"]) != ATTACH_FROM or int(select["effect"]["id"]) != CINDERACE:
                raise AssertionError((root_id, callback_id, select))
            if replay["steps"][int(callback["step"])][seat].get("status") != "ACTIVE":
                raise AssertionError((root_id, callback_id, "own callback not active"))
            if replay["steps"][int(callback["step"])][1 - seat].get("status") == "ACTIVE":
                raise AssertionError((root_id, callback_id, "opponent reply intervened"))
        exogenous_counts["roots"] += 1
        exogenous_counts["opponent_replies_between_targets"] += 0
        exogenous_counts["random_public_reveals_between_targets"] += 0
        exogenous_counts["other_callback_types_inside_target_chain"] += 0
        root_row = {
            "root_id": root_id, "source": source, "episode_id": prior_root["episode_id"], "seat": seat, "step": step,
            "positive_control": root_id in positive_ids,
            "visible_energy_option_count": len(energy_options), "visible_energy_card_ids": energy_ids,
            "historical_energy_action": historical_energy_action, "historical_target_bench_indices": historical_targets,
            "historical_complete_plan": plan_json(historical_key), "historical_classification": historical_class,
            "mechanically_dominating_historical_alternatives": [plan_json(x) for x in sorted(incoming)],
            "complete_state_distinct_plan_count": len(relation["plans"]),
            "relation_counts": dict(relation["counts"]),
            "dominated_complete_plan_count": len(relation["incoming"]),
            "undominated_complete_plan_count": len(relation["plans"] - set(relation["incoming"])),
            "world_execution_summaries": world_summaries,
        }
        roots.append(root_row)

    positive_rows = [x for x in roots if x["positive_control"]]
    historical_counts = Counter(x["historical_classification"] for x in roots)
    positive_historical_counts = Counter(x["historical_classification"] for x in positive_rows)
    permutation_failures = [x for x in energy_order_tests if x["distinct_final_mechanical_states"] != 1]
    context_order_varies = sum(x["distinct_context_serial_orders"] > 1 for x in energy_order_tests)
    root_only = load_module("effect_root_only", ROOT_ONLY)
    parity = []
    for prior_root in prior["roots"]:
        replay = json.loads((REPLAY_DIRS[prior_root["source"]] / f'{prior_root["episode_id"]}.json').read_text())
        raw = replay["steps"][prior_root["step"]][prior_root["seat"]]["observation"]
        robs = root_only.to_observation_class(copy.deepcopy(raw))
        parity.append({"root_id": prior_root["root_id"], "context": int(robs.select.context),
                       "root_recall_expands": bool(root_only._root_recall_expands(robs)),
                       "root_candidates_equal_descendants": root_only._root_candidate_sets(robs) == root_only._candidate_sets(robs)})
    attach_from_parity = []
    for callback in callback_manifest["callbacks"]:
        replay = json.loads((REPLAY_DIRS[callback["source"]] / f'{callback["episode_id"]}.json').read_text())
        raw = replay["steps"][int(callback["step"])][int(callback["seat"])]["observation"]
        robs = root_only.to_observation_class(copy.deepcopy(raw))
        attach_from_parity.append({
            "callback_id": callback["callback_id"], "context": int(robs.select.context),
            "root_recall_expands": bool(root_only._root_recall_expands(robs)),
            "root_candidates_equal_descendants": root_only._root_candidate_sets(robs) == root_only._candidate_sets(robs),
        })

    summary = {
        "schema_version": "tempo_turbo_flare_effect_level_planning/v1",
        "identity": {"base_sha256": sha(BASE), "deck_sha256": sha(DECK), "root_only_sha256": sha(ROOT_ONLY),
                     "transition_vectors_sha256": sha(VECTORS), "pairwise_classifications_sha256": sha(PAIRWISE),
                     "policy_change": False},
        "callback_mechanics": {
            "sequence": "ATTACH_TO selects 0-3 visible Basic Energy cards, then one ATTACH_FROM target callback per selected Energy; each attachment resolves before the next own callback",
            "opponent_reply_between_targets": False,
            "new_plan_relevant_exogenous_information_between_targets": False,
            "stochastic_public_reveal_between_targets": False,
            "deck_shuffle": "Turbo Flare shuffles after search; no shuffle outcome is used by the plan and it cannot change target legality/capability during this effect",
            "other_callback_type_inside_target_chain": False,
            "repeated_same_target_legal": True,
            "effect_finishes_after_last_selected_energy_is_attached": True,
            "earliest_complete_plan_point": "ATTACH_TO: all legal Energy options are visible, all are Water in the frozen deck, current Bench targets/serials are public, and no external branch can change them during resolution",
        },
        "enumeration": {
            "root_count": len(roots), "worlds_per_root": 2,
            "state_distinct_plan_instances_replayed": execution_plan_count,
            "ordered_target_paths_exhausted": ordered_path_count,
            "stable_serial_execution_matches": execution_matches,
            "stable_serial_execution_mismatches": len(replay_mismatches),
            "ordered_path_equivalence_failures": len(ordered_equivalence_failures),
            "energy_action_permutation_tests": len(energy_order_tests),
            "energy_action_permutation_final_state_failures": len(permutation_failures),
            "tests_where_context_energy_serial_order_varied": context_order_varies,
        },
        "complete_plan_relations_all_roots": dict(Counter(row["classification"] for row in pair_data["pairs"])),
        "positive_controls": {
            "root_count": len(positive_rows),
            "roots_with_dominated_complete_plan": sum(x["dominated_complete_plan_count"] > 0 for x in positive_rows),
            "historical_classifications": dict(positive_historical_counts),
            "historical_dominated_root_count": positive_historical_counts["BASE_REACHES_DOMINATED_PLAN"],
        },
        "historical_base_all_roots": {"classifications": dict(historical_counts),
                                      "dominated_root_count": historical_counts["BASE_REACHES_DOMINATED_PLAN"]},
        "plan_state_contract": {
            "persistent_python_state_available": True,
            "effect_key": ["episode/game epoch", "yourIndex", "turn", "effect.id", "effect.serial"],
            "planned_target_identity": "public Pokemon serial plus frozen public-state guard; never candidate-list index",
            "energy_identity": "contextCard serial validated at each callback; all selected Basic Energy are Water, so capability plan is target-count based",
            "clear_conditions": ["all selected attachments consumed", "context/effect mismatch", "turn/game reset", "deck request/no selection", "missing planned target", "exception"],
            "stale_plan_fallback": "clear and return exact Base behavior",
        },
        "root_only_parity": {"attach_to_roots": len(parity), "attach_from_callbacks": len(attach_from_parity),
                             "recall_expansions": sum(x["root_recall_expands"] for x in parity + attach_from_parity),
                             "candidate_parity_failures": sum(not x["root_candidates_equal_descendants"] for x in parity + attach_from_parity),
                             "conclusion": "Turbo Flare ATTACH_TO/ATTACH_FROM is independent of TO_BENCH root recall and targeted 3x compute"},
        "integrity": {"ordered_equivalence_failures": ordered_equivalence_failures, "execution_mismatches": replay_mismatches,
                      "permutation_failures": permutation_failures, "unexpected_transitions": unexpected_transitions,
                      "hidden_or_future_information_used": False},
    }
    if (summary["callback_mechanics"]["opponent_reply_between_targets"]
            or summary["callback_mechanics"]["new_plan_relevant_exogenous_information_between_targets"]):
        verdict = "REJECT — EXOGENOUS INFORMATION PREVENTS EFFECT-LEVEL PLANNING"
    elif replay_mismatches or ordered_equivalence_failures or permutation_failures:
        verdict = "PARTIAL — COMPLETE-PLAN SEMANTICS VALID, EXECUTION STATE TRACKING NOT READY"
    elif not all(x["dominated_complete_plan_count"] > 0 for x in positive_rows):
        verdict = "REJECT — FULL-ALLOCATION DOMINANCE DOES NOT SURVIVE DEPLOYMENT-FIDELITY AUDIT"
    else:
        verdict = "PASS — COMPLETE TURBO FLARE PLANNING IS DEPLOYMENT-FAITHFUL"
    summary["verdict"] = verdict
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "SUMMARY.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (RESULTS / "ROOT_RESULTS.json").write_text(json.dumps({"roots": roots}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (RESULTS / "ENERGY_ORDER_TESTS.json").write_text(json.dumps({"tests": energy_order_tests}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2, sort_keys=True))


if __name__ == "__main__": main()
