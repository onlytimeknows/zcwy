import type { DemoScenarioState, DemoTask } from './demoScenarioTypes';

export const DEMO_SCENARIO_STORAGE_KEY = 'zcwy-demo-scenario-v1';

export const demoTask: DemoTask = {
  id: 'JOB-2026-0801',
  title: '校园品牌活动协助',
  enterpriseName: '青创校园文化有限公司',
  workType: '校园活动执行协助',
  period: '2026年8月1日—2026年8月5日',
  amount: 1260,
  agreementId: 'AGR-2026-0801',
  escrowReceiptId: 'ESCROW-1260',
};

export const deliverableFiles = [
  '活动执行总结.pdf',
  '现场记录照片 6 张',
];

export const deliverableDescription = '已完成现场签到、物料协助与活动秩序维护';

export const settlementSteps = [
  '核验工作周期与打卡记录',
  '核验企业验收结果',
  '校验托管金额 ¥1,260',
  '生成模拟结算指令',
  '模拟薪资划转',
  '生成链上实践证书',
];

export const certificateDetails = {
  evaluation: '认真负责，履约完整',
  credit: '优秀',
  id: 'CERT-2026-0801',
  hash: '0xC8F1A40D7B26E0953A1162DD89F67C20',
};

export const settlementReceipt = {
  transactionId: 'TX-2026-0801',
  hash: '0xA1260E7D9026C40B5F831A690CC8D114',
  allianceConfirmations: '4 / 4',
};

export function createInitialDemoScenarioState(): DemoScenarioState {
  return {
    version: 1,
    stage: 'working',
    task: demoTask,
    student: {
      name: '林知夏',
      creditLevel: '优秀',
      creditPointsEarned: 0,
    },
    enterprise: {
      name: demoTask.enterpriseName,
      verified: true,
      monthlyFulfillmentRate: 100,
    },
    escrow: {
      status: 'held',
      amount: demoTask.amount,
    },
    deliverable: {
      status: 'not-submitted',
      submittedAt: null,
      evidenceId: null,
    },
    acceptance: {
      status: 'waiting',
      acceptedAt: null,
    },
    contract: {
      status: 'pending',
      startedAt: null,
      completedAt: null,
    },
    settlement: {
      status: 'pending',
      transactionId: null,
      transactionHash: null,
      settledAt: null,
    },
    certificate: {
      status: 'pending',
      id: null,
      hash: null,
    },
    latestEvidence: {
      label: '工作记录',
      id: '工作记录 #06',
      hash: '0x7A9F4B283CE031C8',
      recordedAt: '2026-08-05T17:20:00+08:00',
    },
    progress: 6,
    isAnimating: false,
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatScenarioTime(value: string | null) {
  if (!value) {
    return '尚未生成';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '概念演示时间';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
