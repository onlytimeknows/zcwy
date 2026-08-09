import Button from '@douyinfe/semi-ui/lib/es/button';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import styles from './StudentUtilityPages.module.css';

interface UtilityConfig {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryTitle: string;
  primaryCopy: string;
  rows: Array<{ title: string; detail: string; status: string }>;
  action: string;
  actionDone: string;
}

function StudentUtilityPage({ config }: { config: UtilityConfig }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [actionDone, setActionDone] = useState(false);
  return (
    <motion.main className={styles.page} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header><div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div><Button theme="borderless" onClick={() => navigate('/student')}>返回工作台</Button></header>
      <section className={styles.content}>
        <div className={styles.primary}>
          <span className={styles.icon}>{config.icon}</span>
          <div><span>建议继续</span><h2>{config.primaryTitle}</h2><p>{config.primaryCopy}</p></div>
          <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => setActionDone(true)}>{actionDone ? config.actionDone : config.action}</Button>
        </div>
        <div className={styles.rows}>
          {config.rows.map((row) => <div key={row.title}><div><strong>{row.title}</strong><span>{row.detail}</span></div><SemanticStatusTag size="small">{row.status}</SemanticStatusTag></div>)}
        </div>
        <p className={styles.notice} aria-live="polite">{actionDone ? `${config.actionDone} · 概念演示状态` : '所有岗位与账号信息均为本地 Mock 数据'}</p>
      </section>
    </motion.main>
  );
}

export function StudentOpportunitiesPage() {
  return <StudentUtilityPage config={{ eyebrow: '岗位', title: '找兼职', description: '3 个匹配岗位', icon: <IconSearchStroked />, primaryTitle: '按可信度与时间匹配排序', primaryCopy: '最近更新于今天 11:30', action: '更新结果', actionDone: '结果已更新', rows: [{ title: '校园短视频运营助理', detail: '远程协作 · 120–150 元/天', status: '企业已认证' }, { title: '展会双语接待协助', detail: '8月16日 · 260 元/天', status: '薪资已托管' }, { title: '新生季内容编辑', detail: '校内 · 7天项目', status: '协议清晰' }] }} />;
}

export function StudentResumePage() {
  return <StudentUtilityPage config={{ eyebrow: '求职资料', title: '我的简历', description: '完整度 86%', icon: <IconEditStroked />, primaryTitle: '作品与技能待完善', primaryCopy: '建议补充 1 个作品链接', action: '继续完善', actionDone: '已进入编辑状态', rows: [{ title: '基础信息', detail: '教育经历与可参与时间', status: '已完成' }, { title: '实践履历', detail: '1 项实践记录', status: '已同步' }, { title: '作品与技能', detail: '缺少作品链接', status: '待完善' }] }} />;
}

export function StudentMessagesPage() {
  return <StudentUtilityPage config={{ eyebrow: '收件箱', title: '消息', description: '1 条待处理', icon: <IconCommentStroked />, primaryTitle: '青禾数字传媒通过简历初筛', primaryCopy: '今天 10:24 · 预计 1 个工作日内联系', action: '打开沟通', actionDone: '沟通已打开', rows: [{ title: '青禾数字传媒有限公司', detail: '简历初筛通过 · 今天 10:24', status: '待沟通' }, { title: '青创校园文化有限公司', detail: '成果验收进度已同步', status: '任务消息' }] }} />;
}

export function StudentRightsPage() {
  return <StudentUtilityPage config={{ eyebrow: '权益', title: '权益保障', description: '当前状态正常', icon: <IconShieldStroked />, primaryTitle: '兼职薪资已进入托管', primaryCopy: '当前托管金额 ¥1,260', action: '查看当前任务', actionDone: '任务状态已同步', rows: [{ title: '企业认证', detail: '青创校园文化有限公司', status: '已认证' }, { title: '薪资托管', detail: '托管凭证 ESCROW-1260', status: '已托管' }, { title: '可信记录', detail: '工作记录 #06', status: '已存证' }] }} />;
}
