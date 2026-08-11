# Turbo Flare effect-level planning audit

## Verdict

**PASS — COMPLETE TURBO FLARE PLANNING IS DEPLOYMENT-FAITHFUL**

Turbo Flare is one strategic allocation decision that the SDK exposes as several clicks. A complete allocation can be formed legally at `ATTACH_TO`, retained by stable card/Pokémon identity, and executed across the subsequent `ATTACH_FROM` callbacks. No opponent reply, random reveal, or other plan-relevant external event intervenes.

This is a shadow-only feasibility result. No policy, evaluator, candidate generator, package, or Kaggle submission was changed.

## Frozen identity and protocol

- Base: exact `bots/tempo/v5.6.2/main.py`, SHA-256 `da2dbc4925f739c129b2c5f65a603ee4341e956bb8dfd49e26536c69ef9a3fe7`.
- Deck: verified deployed specialist deck, SHA-256 `426189dff5e525eb69cb392637f04fe049b39980d2af9fc79a2f4c4975445f5a`.
- Frozen transition vectors: SHA-256 `5df2a302642d341ab30bca82fd4efd4482717bcd0ebf81d362d8928f9a462101`.
- Frozen pairwise semantics: SHA-256 `0d3fdea297d56e332b06fe446d691ef43424b9d3801b5c1457905955b78ca275`.
- Cohort: all 23 prior genuine Turbo Flare roots, including all 11 positive controls; two frozen search worlds per root.
- Comparisons are only between plans selecting the same number of Energy. The frozen partial order was not redesigned.

## 1. Exact deployed callback chain

1. `ATTACH_TO` (`SelectContext=22`, CARD, `minCount=0`, `maxCount=3`) exposes the searchable Basic Energy cards and accepts zero to three indices.
2. The selected action order determines the Energy resolution order.
3. For each selected Energy, the engine issues one `ATTACH_FROM` (`SelectContext=21`, CARD, exactly one target) with that Energy in `contextCard`.
4. The chosen attachment resolves before the next `ATTACH_FROM` menu is emitted.
5. After the last selected Energy is attached, the effect finishes and the deck shuffle required by Turbo Flare completes.

All frozen deck options were Basic Water Energy. Repeated attachment to the same Benched Pokémon remained legal. Selecting zero Energy produced no target callback.

## 2. Information boundary

There was no opponent `ACTIVE` callback between target choices in any archived chain. There was also no draw, newly revealed hidden card, random public event, or other selection context inside the target chain. The only intermediate public changes were consequences of our own preceding choice: one Energy moved to its target, the board Energy counts changed, and the next `contextCard` became current.

Turbo Flare shuffles the deck, but the shuffle reveals no plan-relevant information and cannot change target legality or attack capability during the effect. It therefore does not invalidate precommitment.

The earliest legal planning point is `ATTACH_TO`: the Energy options and serials are visible there, the current Bench and stable Pokémon serials are public, and no external branch can alter them before resolution. The general plan representation should retain `(Energy card ID, Energy serial, target Pokémon serial)` in resolution order. For this exact deck, all selected cards were mechanically identical Water Energy, so the frozen capability result depends on the target allocation, not Energy-copy identity.

## 3. Complete-plan enumeration

For each genuine root and selected Energy count `k=0..3`, the audit:

1. branched the exact `ATTACH_TO` action;
2. exhausted every legal ordered length-`k` target path through native `search_step`;
3. let every attachment resolve normally;
4. computed the final board immediately after the effect;
5. collapsed paths only when their full public mechanical successor signatures matched.

The audit found 761 root-level state-distinct complete plans. Replaying two frozen worlds produced 1,522 plan instances. It exhausted 3,922 ordered target paths. Different target orders leading to the same final per-Pokémon allocation were equivalent in every tested case: **0/3,922 equivalence failures**.

Energy-card selection order was tested in 88 permutation trials. The later `contextCard` serial order changed in all 88, proving that the engine preserves the selected order, but an identical target path still produced one exact mechanical successor state in every trial: **0/88 failures**. This validates same-ID Water-copy equivalence for this context without assuming it.

## 4. Frozen capability topology on complete plans

Each final plan reused the frozen `ATTACK_THRESHOLD_TRANSITION_VECTOR`, preserving:

- Energy by Pokémon and type;
- exact attack identities, requirements, and before/after deficits;
- newly ready and lost attacks/Pokémon;
- ready Bench replacement set and first-replacement transitions;
- high-cost capability preservation;
- current public Pokémon state and information limits.

Across the 7,751 frozen same-Energy-count plan pairs:

| Classification | Pairs |
|---|---:|
| Strict mechanical dominance | 1,057 |
| Conditional mechanical dominance | 353 |
| Genuine tradeoff | 5,552 |
| Information-limited | 316 |
| Semantically equivalent | 473 |

Thus whole-effect planning does not collapse into "spread Energy". Most pairs remain genuine tradeoffs; only the already validated directional subset is ordered.

## 5. Prior 11 positive controls

Every positive-control root retained at least one dominated complete plan at deployment-faithful whole-effect granularity.

| Root | Complete plans | Dominated plans | Historical selected-Energy count | Historical final Bench Energy vector | Historical Base result |
|---|---:|---:|---:|---|---|
| `turbo_submission_54898083_emergency_87974997_s0_k40` | 56 | 18 | 3 | `1/1/1/0/0` | Genuine tradeoff |
| `turbo_submission_54898083_emergency_87986170_s0_k43` | 56 | 24 | 3 | `1/2/0/0/0` | **Dominated** |
| `turbo_submission_54898083_emergency_88133579_s0_k23` | 35 | 5 | 3 | `1/1/0/1` | Genuine tradeoff |
| `turbo_submission_54898083_emergency_88162728_s1_k26` | 35 | 20 | 3 | `3/0/0/0` | **Dominated** |
| `turbo_submission_55240963_autopsy_89942077_s1_k73` | 35 | 20 | 3 | `2/1/0/0` | **Dominated** |
| `turbo_submission_55240963_autopsy_89952544_s0_k79` | 56 | 6 | 3 | `3/0/0/0/0` | Genuine tradeoff |
| `turbo_submission_55240963_autopsy_89954342_s0_k40` | 56 | 13 | 3 | `3/0/0/1/0` | Genuine tradeoff |
| `turbo_submission_55240963_autopsy_89957644_s0_k86` | 56 | 6 | 3 | `2/0/1/0/0` | Genuine tradeoff |
| `turbo_submission_55240963_autopsy_90012350_s0_k80` | 56 | 8 | 3 | `2/1/1/0/1` | Genuine tradeoff |
| `turbo_submission_55427464_refresh_91938586_s1_k16` | 56 | 18 | 3 | `3/0/0/0/0` | **Dominated** |
| `turbo_submission_55427464_refresh_91938586_s1_k41` | 56 | 48 | 0 | `3/1/0/0/0` | Already undominated |

The final Bench vectors include Energy already attached before Turbo Flare. The zero-selection root is a useful control: dominated counterfactual plans existed in its plan space, but Base's actual zero-Energy plan was not dominated by another zero-Energy plan.

Among the 11 positive controls, historical Base reached a dominated complete allocation in 4, an undominated plan in 1, and one member of a genuine tradeoff in 6. Across all 23 roots the corresponding counts were 5 dominated, 5 already undominated, and 13 tradeoffs. Effect-level planning therefore has real room to act, but must abstain on most legitimate allocation conflicts.

## 6. Cross-callback execution feasibility

A research plan was replayed through the real sequential interface by resolving the `ATTACH_TO` action once, then locating each planned target by stable public Pokémon serial at each subsequent `ATTACH_FROM` callback.

- Complete plan instances executed: 1,522.
- Exact planned-versus-executed successor matches: 1,522.
- Missing/ambiguous planned targets: 0.
- Wrong callback/effect transitions: 0.
- Stale-index or ordering mismatches: 0.

Candidate-list indices are not a safe persistence identity. A future implementation should store stable Energy and Pokémon identities plus public-state guards. The effect key should include game/episode epoch, our seat, turn, effect card ID, and effect serial. Stored state must clear after all attachments, or immediately on any turn/effect/context mismatch, missing target, exception, new game/deck request, or unexpected callback. On any guard failure, exact Base behavior is the safe fallback.

The deployed Python module already retains module-level state across callbacks (`_BELIEF_MEMORY` and `_TIME_MANAGER` do so today), so persistence is architecturally available. This audit did not add such state to the bot.

## 7. Relation to ROOT-ONLY 3x

Code and replay checks found exact independence. ROOT-ONLY recall expands only multi-select `TO_BENCH` CARD roots; Turbo Flare uses `ATTACH_TO` and `ATTACH_FROM`. Across all 23 `ATTACH_TO` roots and all 58 archived `ATTACH_FROM` callbacks:

- recall expansions: 0;
- root-versus-descendant candidate differences: 0.

The targeted 3x compute trigger is likewise limited to qualifying `TO_BENCH` roots. No duplicate Turbo Flare experiment is needed for ROOT-ONLY 3x.

## 8. Interpretation

The previous per-callback confidence problem was a granularity mismatch, not evidence that the full semantic vanished. The SDK decomposes one deterministic own effect into sequential interface callbacks. Planning the complete effect restores the valid full-allocation comparison without pretending that an early micro-choice alone possesses the final plan's capability.

No current-action reachable-plan fallback is needed: full precommitment was legal and exact in the entire audited domain. A later policy experiment may implement a guarded effect-level planner that chooses only a mechanically undominated complete plan and abstains among genuine tradeoffs. That implementation is outside this task.

## Artifacts

- `EXPERIMENT_CONTRACT.md`: frozen protocol and red lines.
- `run_effect_level_audit.py`: deterministic reconstruction, enumeration, relation reuse, and sequential replay.
- `results/SUMMARY.json`: concise machine-readable verdict and integrity totals.
- `results/ROOT_RESULTS.json`: per-root complete plans, historical classifications, dominance counts, and replay traces.
- `results/ENERGY_ORDER_TESTS.json`: Energy-order permutation and same-ID serial-equivalence checks.

