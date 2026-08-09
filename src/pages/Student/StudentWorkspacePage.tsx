import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
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
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
    >
      <header className={styles.contextHeader}>
        <h1>下午好，{state.student.name}</h1>
        <p><strong>1 个新进展</strong><span aria-hidden="true">·</span>1 项任务进行中</p>
      </header>

      <div className={styles.homeGrid}>
        <div className={styles.primaryStack}>
          <section className={styles.applicationSection} aria-labelledby="application-title">
            <div className={styles.sectionHeading}>
              <h2>最近投递</h2>
              <span>1 个新进展</span>
            </div>

            <div className={styles.applicationBody}>
              <div className={styles.applicationIdentity}>
                <div className={styles.jobTitleRow}>
                  <h3 id="application-title">校园短视频运营助理</h3>
                  <SemanticStatusTag tone="success" size="small">初筛通过</SemanticStatusTag>
                </div>
                <p>青禾数字传媒有限公司 <span aria-hidden="true">·</span> 今天 10:24</p>
              </div>

              <div className={styles.applicationUpdate}>
                <strong>企业已通过简历初筛</strong>
                <span>预计 1 个工作日内联系</span>
              </div>
            </div>

            <div className={styles.applicationNext}>
              <span><small>下一步</small>准备课程安排与作品链接</span>
              <Button
                theme="borderless"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate(`/student/applications/${applicationId}`)}
              >
                查看详情
              </Button>
            </div>
          </section>

          <section className={styles.taskSection} aria-labelledby="current-task-title">
            <div className={styles.sectionHeading}>
              <h2>继续处理</h2>
              <span>{state.task.id}</span>
            </div>

            <div className={styles.taskStrip}>
              <div className={styles.taskIdentity}>
                <div className={styles.taskTitleRow}>
                  <h3 id="current-task-title">{state.task.title}</h3>
                  <SemanticStatusTag tone={state.stage === 'settled' ? 'success' : 'value'} size="small">{taskState.status}</SemanticStatusTag>
                </div>
                <p>{state.task.enterpriseName}</p>
              </div>

              <div className={styles.taskProgress}>
                <div><span>{state.progress} / 10</span><small>{taskState.next}</small></div>
                <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              </div>

              <div className={styles.taskValue}>
                <strong>{formatCurrency(state.task.amount)}</strong>
                <span>{state.escrow.status === 'held' ? '已托管' : '已到账'}</span>
              </div>

              <Button
                theme="light"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate(taskRoute)}
              >
                {taskState.action}
              </Button>
            </div>
          </section>
        </div>

        <aside className={styles.contextRail} aria-label="今日工作">
          <section className={styles.quickActions}>
            <h2>快速操作</h2>
            <div>
              {quickEntries.map((entry) => (
                <button key={entry.label} type="button" onClick={() => navigate(entry.route)}>
                  <span className={styles.actionIcon}>{entry.icon}</span>
                  <span><strong>{entry.label}</strong><small>{entry.hint}</small></span>
                  <IconArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>

          <section className={styles.todaySection}>
            <div className={styles.sectionHeading}>
              <h2>今天</h2>
              <span>2 项</span>
            </div>
            <div className={styles.todoList}>
              <button type="button" onClick={() => navigate(`/student/applications/${applicationId}`)}>
                <i className={styles.successDot} aria-hidden="true" />
                <span><strong>跟进最新投递</strong><small>初筛通过，等待企业沟通</small></span>
                <IconArrowRight aria-hidden="true" />
              </button>
              <button type="button" onClick={() => navigate(taskRoute)}>
                <i aria-hidden="true" />
                <span><strong>{taskState.action}</strong><small>{taskState.next}</small></span>
                <IconArrowRight aria-hidden="true" />
              </button>
            </div>
          </section>
        </aside>

        <section className={styles.activitySection} aria-labelledby="activity-title">
          <div className={styles.sectionHeading}>
            <h2 id="activity-title">最近动态</h2>
            <button type="button">查看全部</button>
          </div>
          <div className={styles.activityFeed}>
            {activities.map(([time, event]) => (
              <div key={`${time}-${event}`}>
                <time>{time}</time>
                <span>{event}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
