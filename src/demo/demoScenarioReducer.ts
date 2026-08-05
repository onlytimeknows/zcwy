import {
  certificateDetails,
  createInitialDemoScenarioState,
  settlementReceipt,
} from './demoScenarioData';
import type {
  DemoScenarioAction,
  DemoScenarioStage,
  DemoScenarioState,
  DemoScenarioView,
  ScenarioStatus,
} from './demoScenarioTypes';

export function demoScenarioReducer(
  state: DemoScenarioState,
  action: DemoScenarioAction,
): DemoScenarioState {
  switch (action.type) {
    case 'SUBMIT_DELIVERABLE':
      if (state.stage !== 'working') {
        return state;
      }

      return {
        ...state,
        stage: 'submitted',
        progress: 8,
        deliverable: {
          status: 'submitted',
          submittedAt: action.timestamp,
          evidenceId: 'EVD-SUBMIT-0801',
        },
        acceptance: { status: 'pending', acceptedAt: null },
        latestEvidence: {
          label: '成果提交',
          id: '成果提交 #01',
          hash: '0x3D81B620A75C44E9',
          recordedAt: action.timestamp,
        },
      };

    case 'START_SETTLEMENT':
      if (state.stage !== 'submitted') {
        return state;
      }

      return {
        ...state,
        stage: 'settling',
        progress: 9,
        isAnimating: true,
        deliverable: { ...state.deliverable, status: 'accepted' },
        acceptance: { status: 'accepted', acceptedAt: action.timestamp },
        contract: { status: 'executing', startedAt: action.timestamp, completedAt: null },
        settlement: { ...state.settlement, status: 'processing' },
        latestEvidence: {
          label: '验收记录',
          id: '验收记录 #01',
          hash: '0x8E14C2637AF091B5',
          recordedAt: action.timestamp,
        },
      };

    case 'COMPLETE_SETTLEMENT':
      if (state.stage !== 'settling') {
        return state;
      }

      return {
        ...state,
        stage: 'settled',
        progress: 10,
        isAnimating: false,
        student: { ...state.student, creditPointsEarned: 20 },
        escrow: { ...state.escrow, status: 'released' },
        contract: { ...state.contract, status: 'success', completedAt: action.timestamp },
        settlement: {
          status: 'paid',
          transactionId: settlementReceipt.transactionId,
          transactionHash: settlementReceipt.hash,
          settledAt: action.timestamp,
        },
        certificate: {
          status: 'generated',
          id: certificateDetails.id,
          hash: certificateDetails.hash,
        },
        latestEvidence: {
          label: '实践证书',
          id: '实践证书 #01',
          hash: certificateDetails.hash,
          recordedAt: action.timestamp,
        },
      };

    case 'RESET_SCENARIO':
      return createInitialDemoScenarioState();

    default:
      return state;
  }
}

function isStage(value: unknown): value is DemoScenarioStage {
  return value === 'working' || value === 'submitted' || value === 'settling' || value === 'settled';
}

function asTimestamp(value: unknown, fallback: string) {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime()) ? value : fallback;
}

export function restoreDemoScenarioState(value: unknown): DemoScenarioState {
  if (!value || typeof value !== 'object') {
    return createInitialDemoScenarioState();
  }

  const persisted = value as Record<string, unknown>;
  const persistedState = persisted.state;
  if (persisted.version !== 1 || !persistedState || typeof persistedState !== 'object') {
    return createInitialDemoScenarioState();
  }

  const snapshot = persistedState as Record<string, unknown>;
  if (!isStage(snapshot.stage) || snapshot.taskId !== 'JOB-2026-0801') {
    return createInitialDemoScenarioState();
  }

  const now = new Date().toISOString();
  let restored = createInitialDemoScenarioState();
  if (snapshot.stage === 'working') {
    return restored;
  }

  restored = demoScenarioReducer(restored, {
    type: 'SUBMIT_DELIVERABLE',
    timestamp: asTimestamp(snapshot.submittedAt, now),
  });
  if (snapshot.stage === 'submitted') {
    return restored;
  }

  restored = demoScenarioReducer(restored, {
    type: 'START_SETTLEMENT',
    timestamp: asTimestamp(snapshot.acceptedAt, now),
  });
  if (snapshot.stage === 'settling') {
    return restored;
  }

  return demoScenarioReducer(restored, {
    type: 'COMPLETE_SETTLEMENT',
    timestamp: asTimestamp(snapshot.settledAt, now),
  });
}

function statusByStage(
  stage: DemoScenarioStage,
  completeFrom: DemoScenarioStage,
  activeAt?: DemoScenarioStage,
): ScenarioStatus {
  const order: DemoScenarioStage[] = ['working', 'submitted', 'settling', 'settled'];
  if (order.indexOf(stage) >= order.indexOf(completeFrom)) {
    return 'complete';
  }
  return stage === activeAt ? 'active' : 'pending';
}

export function deriveDemoScenarioView(state: DemoScenarioState): DemoScenarioView {
  const stageViews: Record<DemoScenarioStage, Omit<DemoScenarioView, 'progress' | 'timeline'>> = {
    working: {
      stageLabel: '履约进行中',
      guide: {
        stepLabel: '步骤 1 / 3',
        hint: '请先在学生端提交工作成果',
        actionLabel: '前往学生端',
        actionRoute: '/student',
      },
      home: {
        taskStatus: '履约中',
        workResultStatus: '待提交',
        contractStatus: '待执行',
        nextRoute: '/student',
      },
    },
    submitted: {
      stageLabel: '等待企业验收',
      guide: {
        stepLabel: '步骤 2 / 3',
        hint: '请切换至企业端完成成果验收',
        actionLabel: '前往企业端',
        actionRoute: '/enterprise',
      },
      home: {
        taskStatus: '待验收',
        workResultStatus: '待验收',
        contractStatus: '待执行',
        nextRoute: '/enterprise',
      },
    },
    settling: {
      stageLabel: '合约执行中',
      guide: {
        stepLabel: '正在结算',
        hint: '正在执行模拟智能合约，请稍候',
      },
      home: {
        taskStatus: '结算中',
        workResultStatus: '已验收',
        contractStatus: '执行中',
        nextRoute: '/enterprise',
      },
    },
    settled: {
      stageLabel: '履约已完成',
      guide: {
        stepLabel: '步骤 3 / 3',
        hint: '结算完成，可返回学生端查看实践证书',
        actionLabel: '查看到账与证书',
        actionRoute: '/student',
      },
      home: {
        taskStatus: '已完成',
        workResultStatus: '已验收',
        contractStatus: '已执行',
        nextRoute: '/student',
      },
    },
  };

  const current = stageViews[state.stage];
  const workStatus: ScenarioStatus = state.stage === 'working'
    ? 'active'
    : statusByStage(state.stage, 'submitted');

  return {
    ...current,
    progress: state.progress,
    timeline: [
      { id: 'verified', title: '企业与岗位已认证', detail: '联盟节点认证同步完成', status: 'complete' },
      { id: 'agreement', title: '双方协议已确认', detail: state.task.agreementId, status: 'complete' },
      { id: 'escrow', title: '薪资保证金已托管', detail: state.task.escrowReceiptId, status: 'complete' },
      { id: 'attendance', title: '今日打卡已完成', detail: '打卡记录 5 / 5', status: 'complete' },
      { id: 'records', title: '工作记录已存证', detail: '工作记录 #06', status: 'complete' },
      {
        id: 'deliverable',
        title: state.deliverable.status === 'not-submitted' ? '工作成果待提交' : '工作成果已提交',
        detail: state.deliverable.evidenceId ?? '等待学生提交示例成果',
        status: workStatus,
      },
      {
        id: 'acceptance',
        title: state.acceptance.status === 'accepted' ? '企业已验收' : '企业待验收',
        detail: state.acceptance.status === 'accepted' ? '验收记录 #01' : '等待企业确认成果',
        status: statusByStage(state.stage, 'settling', 'submitted'),
      },
      {
        id: 'contract',
        title: state.contract.status === 'success' ? '智能合约已完成' : state.contract.status === 'executing' ? '智能合约执行中' : '智能合约待执行',
        detail: state.settlement.transactionId ?? '模拟链上环境',
        status: statusByStage(state.stage, 'settled', 'settling'),
      },
      {
        id: 'certificate',
        title: state.certificate.status === 'generated' ? '实践证书已生成' : '实践证书待生成',
        detail: state.certificate.id ?? '结算完成后自动生成',
        status: state.stage === 'settled' ? 'complete' : 'pending',
      },
    ],
  };
}
