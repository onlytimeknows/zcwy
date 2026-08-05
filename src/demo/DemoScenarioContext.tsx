import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  createInitialDemoScenarioState,
  DEMO_SCENARIO_STORAGE_KEY,
} from './demoScenarioData';
import {
  demoScenarioReducer,
  deriveDemoScenarioView,
  restoreDemoScenarioState,
} from './demoScenarioReducer';
import type { DemoScenarioState, DemoScenarioView } from './demoScenarioTypes';

interface DemoScenarioContextValue {
  state: DemoScenarioState;
  view: DemoScenarioView;
  submitDeliverable: () => void;
  startSettlement: () => void;
  completeSettlement: () => void;
  resetScenario: () => void;
}

const DemoScenarioContext = createContext<DemoScenarioContextValue | null>(null);

function loadScenarioState() {
  if (typeof window === 'undefined') {
    return createInitialDemoScenarioState();
  }

  try {
    const raw = window.localStorage.getItem(DEMO_SCENARIO_STORAGE_KEY);
    return raw ? restoreDemoScenarioState(JSON.parse(raw) as unknown) : createInitialDemoScenarioState();
  } catch {
    return createInitialDemoScenarioState();
  }
}

function createPersistedSnapshot(state: DemoScenarioState) {
  return {
    version: 1,
    state: {
      taskId: state.task.id,
      stage: state.stage,
      submittedAt: state.deliverable.submittedAt,
      acceptedAt: state.acceptance.acceptedAt,
      settledAt: state.settlement.settledAt,
    },
  };
}

export function DemoScenarioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(demoScenarioReducer, undefined, loadScenarioState);
  const view = useMemo(() => deriveDemoScenarioView(state), [state]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DEMO_SCENARIO_STORAGE_KEY,
        JSON.stringify(createPersistedSnapshot(state)),
      );
    } catch {
      // 本地存储不可用时仍允许概念演示在当前页面继续运行。
    }
  }, [state]);

  const value = useMemo<DemoScenarioContextValue>(() => ({
    state,
    view,
    submitDeliverable: () => dispatch({ type: 'SUBMIT_DELIVERABLE', timestamp: new Date().toISOString() }),
    startSettlement: () => dispatch({ type: 'START_SETTLEMENT', timestamp: new Date().toISOString() }),
    completeSettlement: () => dispatch({ type: 'COMPLETE_SETTLEMENT', timestamp: new Date().toISOString() }),
    resetScenario: () => {
      try {
        window.localStorage.removeItem(DEMO_SCENARIO_STORAGE_KEY);
      } catch {
        // 重置不依赖本地存储成功。
      }
      dispatch({ type: 'RESET_SCENARIO' });
    },
  }), [state, view]);

  return (
    <DemoScenarioContext.Provider value={value}>
      {children}
    </DemoScenarioContext.Provider>
  );
}

export function useDemoScenario() {
  const context = useContext(DemoScenarioContext);
  if (!context) {
    throw new Error('useDemoScenario 必须在 DemoScenarioProvider 内使用');
  }
  return context;
}
