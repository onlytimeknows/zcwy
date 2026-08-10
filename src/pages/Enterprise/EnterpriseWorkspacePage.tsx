import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { deliverableFiles, formatCurrency, formatScenarioTime } from '../../demo/demoScenarioData';
import styles from './EnterpriseWorkspacePage.module.css';

const stageCopy = {
  working: {
    status: '等待学生提交',
    eventTitle: '尚未收到本次任务成果',
    eventNote: '成果提交后会自动进入企业验收队列',
    action: '查看任务',
    actionRoute: '/enterprise/task',
    taskNote: '学生正在履约',
  },
  submitted: {
    status: '成果待验收',
    eventTitle: '林知夏已提交工作成果',
    eventNote: '活动总结与 6 张现场照片等待确认',
    action: '开始验收',
    actionRoute: '/enterprise/acceptance',
    taskNote: '成果已提交，等待企业确认',
  },
  settling: {
    status: '结算执行中',
    eventTitle: '验收已通过，结算正在执行',
    eventNote: '智能合约正在核验记录并划转薪资',
    action: '查看结算',
    actionRoute: '/enterprise/settlement',
    taskNote: '正在执行模拟智能合约',
  },
  settled: {
    status: '履约已完成',
    eventTitle: '薪资结算与实践证书已完成',
    eventNote: '联盟节点 4 / 4 确认，学生端已同步到账',
    action: '查看凭证',
    actionRoute: '/enterprise/settlement',
    taskNote: '薪资已到账，证书已生成',
  },
} as const;

export function EnterpriseWorkspacePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state } = useDemoScenario();
  const stage = stageCopy[state.stage];
  const pendingCount = state.stage === 'submitted' ? 1 : 0;
  const stageTone = state.stage === 'submitted' ? 'value' : state.stage === 'settled' ? 'success' : 'brand';
  const activities = [
    ['今天', state.deliverable.status === 'not-submitted' ? '林知夏正在完成本次任务' : '林知夏提交的工作成果已同步'],
    ['昨天', '托管账户状态校验完成'],
    ['8/5', '学生打卡记录 5 / 5 已完成'],
    ['8/1', '兼职协议与薪资保证金已确认'],
  ];
  const quickEntries = [
    { label: '成果验收', hint: pendingCount ? '1 项等待处理' : '查看验收记录', icon: <IconFile />, route: '/enterprise/acceptance' },
    { label: '结算管理', hint: state.stage === 'settled' ? '查看结算凭证' : '查看托管与合约', icon: <IconChainStroked />, route: '/enterprise/settlement' },
    { label: '学生视角', hint: '查看状态同步', icon: <IconUser />, route: `/student/tasks/${state.task.id}` },
  ];

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
    >
      <header className={styles.contextHeader}>
        <h1>下午好，青创校园文化</h1>
        <p><strong>{pendingCount ? '1 项待验收' : '履约状态正常'}</strong><span aria-hidden="true">·</span>1 项任务进行中</p>
      </header>

      <div className={styles.homeGrid}>
        <div className={styles.primaryStack}>
          <section className={styles.focusSection} aria-labelledby="enterprise-focus-title">
            <div className={styles.sectionHeading}>
              <h2>{pendingCount ? '待验收成果' : '当前进展'}</h2>
              <span>{pendingCount ? '1 项待处理' : '状态已同步'}</span>
            </div>

            <div className={styles.focusBody}>
              <div className={styles.focusIdentity}>
                <div className={styles.titleRow}>
                  <h3 id="enterprise-focus-title">{state.task.title}</h3>
                  <SemanticStatusTag tone={stageTone} size="small">{stage.status}</SemanticStatusTag>
                </div>
                <p>{state.student.name} <span aria-hidden="true">·</span> {state.student.creditLevel}信用</p>
              </div>

              <div className={styles.focusUpdate}>
                <strong>{stage.eventTitle}</strong>
                <span>{stage.eventNote}</span>
              </div>
            </div>

            <div className={styles.focusNext}>
              <span>
                <small>{state.deliverable.status === 'not-submitted' ? '成果状态' : '提交时间'}</small>
                {state.deliverable.status === 'not-submitted'
                  ? '尚未提交'
                  : `${formatScenarioTime(state.deliverable.submittedAt)} · ${deliverableFiles.length} 类成果`}
              </span>
              <Button
                theme="borderless"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate(stage.actionRoute)}
              >
                {stage.action}
              </Button>
            </div>
          </section>

          <section className={styles.taskSection} aria-labelledby="enterprise-task-title">
            <div className={styles.sectionHeading}>
              <h2>继续处理</h2>
              <span>{state.task.id}</span>
            </div>

            <div className={styles.taskStrip}>
              <div className={styles.taskIdentity}>
                <div className={styles.taskTitleRow}>
                  <h3 id="enterprise-task-title">{state.task.title}</h3>
                  <SemanticStatusTag tone={stageTone} size="small">{stage.status}</SemanticStatusTag>
                </div>
                <p>{state.task.workType} · {state.task.period}</p>
              </div>

              <div className={styles.taskProgress}>
                <div><span>{state.progress} / 10</span><small>{stage.taskNote}</small></div>
                <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              </div>

              <div className={styles.taskValue}>
                <strong>{formatCurrency(state.task.amount)}</strong>
                <span>{state.escrow.status === 'held' ? '已托管' : '已结算'}</span>
              </div>

              <Button
                theme="light"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate('/enterprise/task')}
              >
                查看任务
              </Button>
            </div>
          </section>
        </div>

        <aside className={styles.contextRail} aria-label="企业今日工作">
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
              <button type="button" onClick={() => navigate(stage.actionRoute)}>
                <i className={pendingCount ? styles.attentionDot : styles.successDot} aria-hidden="true" />
                <span><strong>{stage.action}</strong><small>{stage.eventTitle}</small></span>
                <IconArrowRight aria-hidden="true" />
              </button>
              <button type="button" onClick={() => navigate('/enterprise/settlement')}>
                <i aria-hidden="true" />
                <span><strong>核对资金状态</strong><small>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '托管正常' : '结算完成'}</small></span>
                <IconArrowRight aria-hidden="true" />
              </button>
            </div>
          </section>
        </aside>

        <section className={styles.activitySection} aria-labelledby="enterprise-activity-title">
          <div className={styles.sectionHeading}>
            <h2 id="enterprise-activity-title">最近动态</h2>
            <button type="button" onClick={() => navigate('/enterprise/task')}>查看任务记录</button>
          </div>
          <div className={styles.activityFeed}>
            {activities.map(([time, label]) => (
              <div key={`${time}-${label}`}><time>{time}</time><span>{label}</span></div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
