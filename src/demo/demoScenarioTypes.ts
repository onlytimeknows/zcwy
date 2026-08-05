export type DemoScenarioStage = 'working' | 'submitted' | 'settling' | 'settled';

export type ScenarioStatus = 'pending' | 'active' | 'complete';

export interface DemoTask {
  id: string;
  title: string;
  enterpriseName: string;
  workType: string;
  period: string;
  amount: number;
  agreementId: string;
  escrowReceiptId: string;
}

export interface EvidenceRecord {
  label: string;
  id: string;
  hash: string;
  recordedAt: string;
}

export interface DemoScenarioState {
  version: 1;
  stage: DemoScenarioStage;
  task: DemoTask;
  student: {
    name: string;
    creditLevel: string;
    creditPointsEarned: number;
  };
  enterprise: {
    name: string;
    verified: boolean;
    monthlyFulfillmentRate: number;
  };
  escrow: {
    status: 'held' | 'released';
    amount: number;
  };
  deliverable: {
    status: 'not-submitted' | 'submitted' | 'accepted';
    submittedAt: string | null;
    evidenceId: string | null;
  };
  acceptance: {
    status: 'waiting' | 'pending' | 'accepted';
    acceptedAt: string | null;
  };
  contract: {
    status: 'pending' | 'executing' | 'success';
    startedAt: string | null;
    completedAt: string | null;
  };
  settlement: {
    status: 'pending' | 'processing' | 'paid';
    transactionId: string | null;
    transactionHash: string | null;
    settledAt: string | null;
  };
  certificate: {
    status: 'pending' | 'generated';
    id: string | null;
    hash: string | null;
  };
  latestEvidence: EvidenceRecord;
  progress: number;
  isAnimating: boolean;
}

export type DemoScenarioAction =
  | { type: 'SUBMIT_DELIVERABLE'; timestamp: string }
  | { type: 'START_SETTLEMENT'; timestamp: string }
  | { type: 'COMPLETE_SETTLEMENT'; timestamp: string }
  | { type: 'RESET_SCENARIO' };

export interface TimelineItem {
  id: string;
  title: string;
  detail: string;
  status: ScenarioStatus;
}

export interface DemoScenarioView {
  stageLabel: string;
  progress: number;
  guide: {
    stepLabel: string;
    hint: string;
    actionLabel?: string;
    actionRoute?: '/student' | '/enterprise';
  };
  home: {
    taskStatus: string;
    workResultStatus: string;
    contractStatus: string;
    nextRoute: '/student' | '/enterprise';
  };
  timeline: TimelineItem[];
}
