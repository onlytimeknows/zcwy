import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { formatCurrency } from '../../demo/demoScenarioData';
import styles from './StudentWorkspacePage.module.css';

const applicationId = 'APP-2026-0812';

const stageCopy = {
  working: { status: '成果待提交', next: '提交本次工作成果', action: '继续任务' },
  submitted: { status: '等待企业验收', next: '成果已提交，等待企业确认', action: '查看任务' },
  settling: { status: '结算执行中', next: '履约记录正在核验', action: '查看进度' },
  settled: { status: '已完成结算', next: '薪资已到账，证书已生成', action: '查看证书' },
} as const;

const quickEntries = [
  { label: '搜索兼职', hint: '查看可信岗位', icon: <IconSearchStroked />, route: '/student/opportunities' },
  { label: '优化简历', hint: '完善求职资料', icon: <IconEditStroked />, route: '/student/resume' },
  { label: '联系企业', hint: '继续上次沟通', icon: <IconCommentStroked />, route: '/student/messages' },
];

export function StudentWorkspacePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state } = useDemoScenario();
  const taskState = stageCopy[state.stage];
  const taskRoute = `/student/tasks/${state.task.id}`;
  const activities = [
    ['10:24', '青禾数字传媒通过简历初筛'],
    ['昨天', state.deliverable.status === 'not-submitted' ? '工作记录 #06 已存证' : '校园品牌活动协助成果提交已存证'],
    ['8/5', '今日打卡完成'],
    ['8/4', '企业查看了你的简历'],
  ];

  return (
    <motion.main className={styles.page} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <header className={styles.contextHeader}>
        <h1>下午好，{state.student.name}</h1>
        <p>你有 1 个待跟进的投递，1 项兼职任务正在进行。</p>
      </header>

      <div className={styles.workspaceGrid}>
        <div className={styles.primaryColumn}>
          <section className={styles.applicationPanel} aria-labelledby="application-title">
            <div className={styles.panelTopline}>
              <span>最近投递</span>
              <SemanticStatusTag tone="success">初筛通过</SemanticStatusTag>
            </div>
            <div className={styles.applicationMain}>
              <div>
                <h2 id="application-title">校园短视频运营助理</h2>
                <p>青禾数字传媒有限公司 · 今天 10:24 更新</p>
              </div>
              <div className={styles.applicationResult}>
                <span>最新结果</span>
                <strong>企业已通过简历初筛</strong>
                <small>预计 1 个工作日内联系</small>
              </div>
            </div>
            <div className={styles.panelFooter}>
              <span>下一步 · 准备课程安排与作品链接</span>
              <Button theme="light" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate(`/student/applications/${applicationId}`)}>查看投递</Button>
            </div>
          </section>

          <section className={styles.currentTask} aria-labelledby="current-task-title">
            <div className={styles.taskIdentity}>
              <span className={styles.taskIcon}><IconBriefcaseStroked /></span>
              <div><span>继续处理 · {state.task.id}</span><h2 id="current-task-title">{state.task.title}</h2><p>{state.task.enterpriseName}</p></div>
            </div>
            <div className={styles.taskProgress}>
              <div><span>{taskState.status}</span><strong>{state.progress} / 10</strong></div>
              <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              <small>{taskState.next}</small>
            </div>
            <div className={styles.taskAction}>
              <span>{formatCurrency(state.task.amount)} <small>{state.escrow.status === 'held' ? '已托管' : '已到账'}</small></span>
              <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate(taskRoute)}>{taskState.action}</Button>
            </div>
          </section>

          <section className={styles.activity} aria-labelledby="activity-title">
            <div className={styles.sectionHeading}><h2 id="activity-title">最近动态</h2><button type="button">查看全部</button></div>
            <div className={styles.activityList}>
              {activities.map(([time, event]) => <div key={`${time}-${event}`}><time>{time}</time><span>{event}</span></div>)}
            </div>
          </section>
        </div>

        <aside className={styles.sideRail} aria-label="今日概览">
          <section className={styles.quickActions}>
            <h2>快速操作</h2>
            {quickEntries.map((entry) => <button key={entry.label} type="button" onClick={() => navigate(entry.route)}><span>{entry.icon}</span><span><strong>{entry.label}</strong><small>{entry.hint}</small></span><IconArrowRight /></button>)}
          </section>

          <section className={styles.agenda}>
            <div className={styles.sectionHeading}><h2>今日待办</h2><span>2 项</span></div>
            <button type="button" onClick={() => navigate(taskRoute)}><i /><span><strong>{taskState.action}</strong><small>{taskState.next}</small></span></button>
            <button type="button" onClick={() => navigate('/student/messages')}><i className={styles.successDot} /><span><strong>跟进最新投递</strong><small>初筛通过，等待企业沟通</small></span></button>
          </section>

          <section className={styles.protectionSummary}>
            <div className={styles.sectionHeading}><h2>保障状态</h2><IconShieldStroked /></div>
            <dl>
              <div><dt>薪资保障</dt><dd>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '已托管' : '已到账'}</dd></div>
              <div><dt>可信记录</dt><dd>{state.latestEvidence.id}</dd></div>
              <div><dt>实践信用</dt><dd>{state.student.creditLevel}</dd></div>
            </dl>
            <button type="button" onClick={() => navigate(taskRoute)}>查看履约与证书 <IconArrowRight /></button>
          </section>
        </aside>
      </div>
    </motion.main>
  );
}
