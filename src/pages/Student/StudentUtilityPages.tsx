import Button from '@douyinfe/semi-ui/lib/es/button';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import { motion, useReducedMotion } from 'framer-motion';
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
}

function StudentUtilityPage({ config }: { config: UtilityConfig }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  return (
    <motion.main className={styles.page} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header><div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div><Button theme="borderless" onClick={() => navigate('/student')}>返回工作台</Button></header>
      <section className={styles.content}>
        <div className={styles.primary}>
          <span className={styles.icon}>{config.icon}</span>
          <div><span>建议继续</span><h2>{config.primaryTitle}</h2><p>{config.primaryCopy}</p></div>
          <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right">{config.action}</Button>
        </div>
        <div className={styles.rows}>
          {config.rows.map((row) => <div key={row.title}><div><strong>{row.title}</strong><span>{row.detail}</span></div><SemanticStatusTag size="small">{row.status}</SemanticStatusTag></div>)}
        </div>
        <p className={styles.notice}>概念演示模块 · 当前仅展示主要信息层级与操作入口</p>
      </section>
    </motion.main>
  );
}

export function StudentOpportunitiesPage() {
  return <StudentUtilityPage config={{ eyebrow: '可信岗位', title: '搜索兼职', description: '优先查看企业已认证、薪资规则清晰的岗位。', icon: <IconSearchStroked />, primaryTitle: '3 个岗位与你的时间安排匹配', primaryCopy: '已根据可参与时间与校园实践方向整理，所有结果均为本地 Mock 数据。', action: '查看匹配岗位', rows: [{ title: '校园短视频运营助理', detail: '远程协作 · 120–150 元/天', status: '企业已认证' }, { title: '展会双语接待协助', detail: '8月16日 · 260 元/天', status: '薪资已托管' }, { title: '新生季内容编辑', detail: '校内 · 7天项目', status: '协议清晰' }] }} />;
}

export function StudentResumePage() {
  return <StudentUtilityPage config={{ eyebrow: '求职资料', title: '我的简历', description: '用可信实践记录补充简历，而不是重复填写经历。', icon: <IconEditStroked />, primaryTitle: '简历完整度 86%', primaryCopy: '补充一个作品链接后，更适合投递内容运营与校园活动类岗位。', action: '继续完善', rows: [{ title: '基础信息', detail: '教育经历与可参与时间', status: '已完成' }, { title: '实践履历', detail: '1 项链上实践记录', status: '已同步' }, { title: '作品与技能', detail: '建议补充作品链接', status: '待完善' }] }} />;
}

export function StudentMessagesPage() {
  return <StudentUtilityPage config={{ eyebrow: '企业沟通', title: '消息', description: '集中处理与投递、录用和履约有关的沟通。', icon: <IconCommentStroked />, primaryTitle: '青禾数字传媒已查看你的简历', primaryCopy: '企业预计在 1 个工作日内联系你，可提前准备课程安排和作品链接。', action: '查看沟通', rows: [{ title: '青禾数字传媒有限公司', detail: '简历初筛通过 · 今天 10:24', status: '待沟通' }, { title: '青创校园文化有限公司', detail: '成果验收进度已同步', status: '任务消息' }] }} />;
}
