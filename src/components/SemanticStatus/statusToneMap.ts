import type { DemoScenarioStage, DemoScenarioState } from '../../demo/demoScenarioTypes';
import type { SemanticTone } from './SemanticStatusTag';

export const scenarioStageTone: Record<DemoScenarioStage, SemanticTone> = {
  working: 'brand',
  submitted: 'value',
  settling: 'record',
  settled: 'success',
};

export function deliverableTone(state: DemoScenarioState): SemanticTone {
  if (state.deliverable.status === 'accepted') {
    return 'success';
  }

  return state.deliverable.status === 'submitted' ? 'record' : 'neutral';
}

export function acceptanceTone(state: DemoScenarioState): SemanticTone {
  if (state.acceptance.status === 'accepted') {
    return 'success';
  }

  return state.acceptance.status === 'pending' ? 'value' : 'neutral';
}
