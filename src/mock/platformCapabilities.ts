import type {
  HomeModule,
  JourneyPhase,
  TrustNetworkConnection,
  TrustNetworkNode,
} from '../types/platform';

export const journeyPhases: JourneyPhase[] = [
  {
    id: 'before-work',
    stage: '01',
    eyebrow: '事前 · 把风险挡在入场之前',
    title: '可信准入',
    description: '企业认证、岗位风险提示与双方协议确认，让学生先看清，再决定。',
    icon: 'shield',
    evidence: ['企业资质已核验', '岗位风险已扫描'],
    tone: 'blue',
    checkpoint: { x: 18, y: 80 },
  },
  {
    id: 'during-work',
    stage: '02',
    eyebrow: '事中 · 让每个关键动作可追溯',
    title: '过程存证',
    description: '保证金、打卡、工作记录与成果提交形成连续、清晰的可信轨迹。',
    icon: 'chain',
    evidence: ['薪资保证金已托管', '工作记录已存证'],
    tone: 'purple',
    checkpoint: { x: 48, y: 86 },
  },
  {
    id: 'after-work',
    stage: '03',
    eyebrow: '事后 · 让劳动成果有确定回应',
    title: '履约保障',
    description: '验收触发模拟合约结算，并沉淀证据包、信用积分与实践证书。',
    icon: 'settlement',
    evidence: ['智能合约执行成功', '实践证书已生成'],
    tone: 'yellow',
    checkpoint: { x: 78, y: 76 },
  },
];

export const trustNetworkNodes: TrustNetworkNode[] = [
  {
    id: 'university',
    label: '高校节点',
    status: '认证同步完成',
    responsibility: '核验学籍与实践履历',
    position: { x: 22, y: 40 },
    activePhases: ['before-work'],
  },
  {
    id: 'platform',
    label: '平台节点',
    status: '运行正常',
    responsibility: '记录岗位、协议与履约过程',
    position: { x: 49, y: 51 },
    activePhases: ['before-work', 'during-work', 'after-work'],
  },
  {
    id: 'regulator',
    label: '监管节点',
    status: '数据已同步',
    responsibility: '参与信用记录与纠纷凭证验证',
    position: { x: 72, y: 31 },
    activePhases: ['before-work', 'after-work'],
  },
  {
    id: 'notary',
    label: '公证节点',
    status: '存证已确认',
    responsibility: '提供可信时间戳与证据校验',
    position: { x: 70, y: 63 },
    activePhases: ['during-work', 'after-work'],
  },
];

export const trustNetworkConnections: TrustNetworkConnection[] = [
  {
    id: 'university-platform',
    path: 'M 22 40 Q 35 39 49 51',
    activePhases: ['before-work'],
  },
  {
    id: 'platform-regulator',
    path: 'M 49 51 Q 58 35 72 31',
    activePhases: ['before-work', 'after-work'],
  },
  {
    id: 'platform-notary',
    path: 'M 49 51 Q 59 59 70 63',
    activePhases: ['during-work', 'after-work'],
  },
  {
    id: 'university-notary',
    path: 'M 22 40 Q 39 66 70 63',
    activePhases: ['during-work'],
  },
  {
    id: 'regulator-notary',
    path: 'M 72 31 Q 78 47 70 63',
    activePhases: ['after-work'],
  },
];

export const homeModules: HomeModule[] = [
  {
    id: 'demo',
    path: '/demo',
    label: '推荐主线 · 约 3 分钟',
    title: '完整流程演示',
    description: '沿着学生与企业双方视角，体验从可信岗位到实践证书的完整闭环。',
    icon: 'play',
    tone: 'dark',
    action: '开始演示',
  },
  {
    id: 'student',
    path: '/student',
    label: '学生工作台',
    title: '放心找、安心做、及时拿',
    description: '查看岗位、协议、工作记录、薪资状态和个人实践信用。',
    icon: 'student',
    tone: 'blue',
    action: '进入学生端',
  },
  {
    id: 'enterprise',
    path: '/enterprise',
    label: '企业工作台',
    title: '把招聘与履约放在同一条可信轨迹中',
    description: '管理岗位、录用、保证金、成果验收与薪资结算。',
    icon: 'enterprise',
    tone: 'yellow',
    action: '进入企业端',
  },
  {
    id: 'help',
    path: '/help',
    label: '权益保障中心',
    title: '证据清楚，申诉不再无从下手',
    description: '查看风险提示、证据时间线、模拟证据包与申诉进度。',
    icon: 'help',
    tone: 'purple',
    action: '查看保障能力',
  },
];
