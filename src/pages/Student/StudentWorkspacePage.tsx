import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { formatCurrency } from '../../demo/demoScenarioData';
import styles from './StudentWorkspacePage.module.css';

const applicationId = 'APP-2026-0812';

const stageCopy = {
  working: {
    status: '成果待提交',
    summary: '履约记录已同步，可以提交本次工作成果',
    reminder: '工作成果尚未提交',
    action: '继续任务',
  },
  submitted: {
    status: '等待企业验收',
    summary: '成果已经提交，目前等待企业确认',
    reminder: '成果验收状态待企业更新',
    action: '查看任务',
  },
  settling: {
    status: '结算执行中',
    summary: '企业已经完成验收，结算记录正在核验',
    reminder: '结算流程正在执行',
    action: '查看进度',
  },
  settled: {
    status: '已完成结算',
    summary: '薪资已经到账，实践证书已生成',
    reminder: '结算凭证与实践证书已生成',
    action: '查看证书',
  },
} as const;

const quickEntries = [
  { label: '搜索兼职', hint: '查看可信岗位', icon: <IconSearchStroked />, route: '/student/opportunities' },
  { label: '优化简历', hint: '完善求职资料', icon: <IconEditStroked />, route: '/student/resume' },
  { label: '联系企业', hint: '继续上次沟通', icon: <IconCommentStroked />, route: '/student/messages' },
];

function getTimeGreeting(hour: number) {
  if (hour >= 5 && hour < 11) return '早上好';
  if (hour >= 11 && hour < 14) return '中午好';
  if (hour >= 14 && hour < 19) return '下午好';
  return '晚上好';
}

const activityTrendByStage = {
  working: [0, 1, 1, 2, 1, 1, 1],
  submitted: [0, 1, 1, 2, 1, 2, 3],
  settling: [0, 1, 1, 2, 2, 3, 2],
  settled: [1, 1, 2, 1, 2, 3, 2],
} as const;

function getRecentDateLabels() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
}

function MiniProgressTrend({ stage }: { stage: keyof typeof activityTrendByStage }) {
  const values = activityTrendByStage[stage];
  const labels = getRecentDateLabels();
  const points = values.map((value, index) => {
    const x = 6 + index * 37;
    const y = 58 - value * 14;
    return `${x},${y}`;
  }).join(' ');
  const total = values.reduce<number>((sum, value) => sum + value, 0);
  const current = values.at(-1) ?? 0;

  return (
    <section className={styles.miniTrend} aria-labelledby="mini-trend-title">
      <div className={styles.trendHeading}>
        <span><strong id="mini-trend-title">最近 7 天进展</strong><small>求职与履约动态</small></span>
        <b>{total}<small>次关键更新</small></b>
      </div>
      <svg viewBox="0 0 234 68" role="img" aria-label={`最近七天共有 ${total} 次关键更新，今天 ${current} 次`}>
        <line x1="6" y1="58" x2="228" y2="58" className={styles.trendBaseline} />
        <polyline points={points} className={styles.trendLine} />
        <circle cx="228" cy={58 - current * 14} r="3.5" className={styles.trendPoint} />
      </svg>
      <div className={styles.trendDates}><span>{labels[0]}</span><span>今天</span></div>
    </section>
  );
}

export function StudentWorkspacePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state } = useDemoScenario();
  const taskState = stageCopy[state.stage];
  const taskRoute = `/student/tasks/${state.task.id}`;
  const greeting = getTimeGreeting(new Date().getHours());

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
    >
      <header className={styles.overviewBand}>
        <div className={styles.overviewMain}>
          <div className={styles.greetingCopy}>
            <h1>{greeting}，{state.student.name}</h1>
            <p><strong>1 项新进展需要关注</strong><span aria-hidden="true">·</span>1 项任务进行中</p>
          </div>
          <MiniProgressTrend stage={state.stage} />
        </div>
      </header>

      <div className={styles.workGrid}>
        <section className={styles.taskSection} aria-labelledby="current-task-title">
            <div className={styles.sectionHeading}>
              <h2>当前任务</h2>
              <span>{state.task.id}</span>
            </div>

            <div className={styles.taskWorkspace}>
              <div className={styles.taskIdentity}>
                <h3 id="current-task-title">{state.task.title}</h3>
                <span className={`${styles.taskStatus} ${state.stage === 'settled' ? styles.taskStatusSuccess : ''}`}>
                  <i aria-hidden="true" />
                  {taskState.status}
                </span>
              </div>

              <p className={styles.taskSummary}>{taskState.summary}</p>

              <div className={styles.taskProgress}>
                <div><span>任务进度</span><strong>{state.progress} / 10</strong></div>
                <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskValue}>
                  <small>薪资保障</small>
                  <strong>{formatCurrency(state.task.amount)} <span>{state.escrow.status === 'held' ? '已托管' : '已到账'}</span></strong>
                </div>

                <Button
                  theme="borderless"
                  type="primary"
                  icon={<IconArrowRight />}
                  iconPosition="right"
                  onClick={() => navigate(taskRoute)}
                >
                  {taskState.action}
                </Button>
              </div>
            </div>
        </section>

        <section className={styles.updateSection} aria-labelledby="application-title">
            <div className={styles.sectionHeading}>
              <h2>最近更新</h2>
              <time>今天 10:24</time>
            </div>

            <div className={styles.updatePanel}>
              <div className={styles.updateObject}>
                <h3 id="application-title">校园短视频运营助理</h3>
                <p>青禾数字传媒有限公司</p>
              </div>

              <div className={styles.updateResult}>
                <i className={styles.successDot} aria-hidden="true" />
                <div>
                  <strong>企业已通过简历初筛</strong>
                  <span>预计 1 个工作日内联系</span>
                </div>
              </div>

              <div className={styles.updateAction}>
                <span><small>下一步</small><strong>准备课程安排与作品链接</strong></span>
                <Button
                  className={styles.applicationCta}
                  theme="borderless"
                  type="primary"
                  icon={<IconArrowRight />}
                  iconPosition="right"
                  onClick={() => navigate(`/student/applications/${applicationId}`)}
                >
                  查看投递进展
                </Button>
              </div>
            </div>
        </section>

        <nav className={styles.quickTools} aria-labelledby="quick-tools-title">
            <div className={styles.sectionHeading}>
              <h2 id="quick-tools-title">常用工具</h2>
            </div>
            <div className={styles.quickToolList}>
              {quickEntries.map((entry) => (
                <button key={entry.label} type="button" onClick={() => navigate(entry.route)}>
                  <span>{entry.icon}</span>
                  <strong>{entry.label}</strong>
                </button>
              ))}
            </div>
        </nav>

        <section className={styles.freshSection} aria-labelledby="message-reminders-title">
            <div className={styles.sectionHeading}>
              <h2 id="message-reminders-title">消息与提醒</h2>
              <span>6 条</span>
            </div>
            <div className={styles.freshList}>
              <button type="button" onClick={() => navigate(`/student/applications/${applicationId}`)}>
                <span><small>新消息 · 10:24</small><strong>青禾数字传媒补充了作品链接要求</strong></span>
              </button>
              <button type="button" onClick={() => navigate(taskRoute)}>
                <span><small>进度提醒 · 今天</small><strong>{taskState.reminder}</strong></span>
              </button>
              <button type="button" onClick={() => navigate('/student/rights')}>
                <span><small>平台提醒 · 昨天</small><strong>成果存证已同步至权益记录</strong></span>
              </button>
              <button type="button" onClick={() => navigate(taskRoute)}>
                <span><small>打卡提醒 · 8/5</small><strong>今日打卡记录已同步</strong></span>
              </button>
            </div>
            <button className={styles.freshMore} type="button" onClick={() => navigate('/student/messages')}>
              查看全部 6 条 <IconArrowRight />
            </button>
        </section>
      </div>
    </motion.main>
  );
}
