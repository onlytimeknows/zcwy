import type {
  DemoScenarioStage,
  DemoScenarioState,
  ScenarioStatus,
} from './demoScenarioTypes';

export interface TaskTrendPoint {
  date: string;
  plan: number;
  actual: number;
}

export interface EvidenceSegment {
  id: string;
  label: string;
  status: ScenarioStatus;
}

export interface EscrowFlowNode {
  id: string;
  label: string;
  detail: string;
  status: ScenarioStatus;
}

const trendDates = ['8/1', '8/2', '8/3', '8/4', '8/5'];

const plannedTrend = [2, 4, 6, 8, 10];

const actualTrend: Record<DemoScenarioStage, number[]> = {
  working: [1, 3, 5, 6, 6],
  submitted: [1, 3, 5, 7, 8],
  settling: [1, 3, 5, 8, 9],
  settled: [1, 3, 5, 8, 10],
};

export function getTaskTrend(stage: DemoScenarioStage): TaskTrendPoint[] {
  return trendDates.map((date, index) => ({
    date,
    plan: plannedTrend[index],
    actual: actualTrend[stage][index],
  }));
}

export function getEvidenceSegments(state: DemoScenarioState): EvidenceSegment[] {
  return [
    { id: 'agreement', label: '协议确认', status: 'complete' },
    { id: 'attendance', label: '打卡记录', status: 'complete' },
    { id: 'records', label: '工作记录', status: 'complete' },
    {
      id: 'deliverable',
      label: '成果提交',
      status: state.deliverable.status === 'not-submitted' ? 'active' : 'complete',
    },
    {
      id: 'acceptance',
      label: '企业验收',
      status: state.acceptance.status === 'accepted'
        ? 'complete'
        : state.acceptance.status === 'pending'
          ? 'active'
          : 'pending',
    },
    {
      id: 'contract',
      label: '合约执行',
      status: state.contract.status === 'success'
        ? 'complete'
        : state.contract.status === 'executing'
          ? 'active'
          : 'pending',
    },
    {
      id: 'certificate',
      label: '证书生成',
      status: state.certificate.status === 'generated' ? 'complete' : 'pending',
    },
  ];
}

export function getEscrowFlow(state: DemoScenarioState): EscrowFlowNode[] {
  const stageStatus: Record<DemoScenarioStage, ScenarioStatus[]> = {
    working: ['complete', 'active', 'pending', 'pending', 'pending'],
    submitted: ['complete', 'complete', 'active', 'pending', 'pending'],
    settling: ['complete', 'complete', 'complete', 'active', 'pending'],
    settled: ['complete', 'complete', 'complete', 'complete', 'complete'],
  };
  const statuses = stageStatus[state.stage];

  return [
    { id: 'deposit', label: '企业保证金', detail: '资金已预存', status: statuses[0] },
    { id: 'escrow', label: '合约托管', detail: state.task.escrowReceiptId, status: statuses[1] },
    { id: 'acceptance', label: '企业验收', detail: state.acceptance.status === 'accepted' ? '验收已通过' : '等待成果确认', status: statuses[2] },
    { id: 'payment', label: '薪资到账', detail: state.settlement.status === 'paid' ? '已完成划转' : '验收后自动触发', status: statuses[3] },
    { id: 'certificate', label: '证书生成', detail: state.certificate.id ?? '结算后自动生成', status: statuses[4] },
  ];
}
