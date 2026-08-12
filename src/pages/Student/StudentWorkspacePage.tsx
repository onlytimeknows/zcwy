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
        <p><strong>1 项新进展需要关注</strong><span aria-hidden="true">·</span>1 项任务进行中</p>
      </header>

      <div className={styles.homeGrid}>
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
                theme="solid"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate(`/student/applications/${applicationId}`)}
              >
                查看投递详情
              </Button>
            </div>
          </div>
        </section>

        <div className={styles.longTermArea}>
          <section className={styles.taskSection} aria-labelledby="current-task-title">
            <div className={styles.sectionHeading}>
              <h2>当前任务</h2>
              <span>{state.task.id}</span>
            </div>

            <div className={styles.taskStrip}>
              <div className={styles.taskIdentity}>
                <div className={styles.taskTitleRow}>
                  <h3 id="current-task-title">{state.task.title}</h3>
                  <SemanticStatusTag tone={state.stage === 'settled' ? 'success' : 'value'} size="small">{taskState.status}</SemanticStatusTag>
                </div>
              </div>

              <div className={styles.taskProgress}>
                <div><span>{state.progress} / 10</span><small>履约进度</small></div>
                <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              </div>

              <div className={styles.taskValue}>
                <strong>{formatCurrency(state.task.amount)}</strong>
                <span>{state.escrow.status === 'held' ? '薪资已托管' : '薪资已到账'}</span>
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
          </section>

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

        <aside className={styles.contextRail} aria-label="新鲜信息与常用工具">
          <section className={styles.freshSection}>
            <div className={styles.sectionHeading}>
              <h2>新鲜信息</h2>
              <span>3 条</span>
            </div>
            <div className={styles.freshList}>
              <button type="button" onClick={() => navigate(`/student/applications/${applicationId}`)}>
                <span><small>新消息 · 10:24</small><strong>青禾数字传媒预计 1 个工作日内联系</strong></span>
              </button>
              <button type="button" onClick={() => navigate(taskRoute)}>
                <span><small>进度提醒 · 今天</small><strong>{taskState.next}</strong></span>
              </button>
              <button type="button" onClick={() => navigate('/student/rights')}>
                <span><small>平台提醒 · 昨天</small><strong>成果存证已同步至权益记录</strong></span>
              </button>
            </div>
          </section>

          <section className={styles.quickActions}>
            <h2>常用工具</h2>
            <div>
              {quickEntries.map((entry) => (
                <button key={entry.label} type="button" onClick={() => navigate(entry.route)}>
                  <span className={styles.actionIcon}>{entry.icon}</span>
                  <span><strong>{entry.label}</strong><small>{entry.hint}</small></span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </motion.main>
  );
}
