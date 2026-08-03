import type { PlatformCapability } from '../types/platform';

export const platformCapabilities: PlatformCapability[] = [
  {
    id: 'trusted-position',
    title: '可信岗位与企业认证',
    description: '通过本地 Mock 状态展示企业资质、岗位风险提示与信用记录。',
    icon: 'shield',
  },
  {
    id: 'traceable-process',
    title: '兼职全过程存证',
    description: '以时间线和状态反馈模拟协议、打卡、成果与验收信息留痕。',
    icon: 'chain',
  },
  {
    id: 'secured-payment',
    title: '薪资托管与结算',
    description: '模拟保证金托管、智能合约执行和薪资到账的完整过程。',
    icon: 'settlement',
  },
];
