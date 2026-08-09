import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconEditStroked from '@douyinfe/semi-icons/lib/es/icons/IconEditStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { formatCurrency } from '../../demo/demoScenarioData';
import styles from './StudentWorkspacePage.module.css';

const applicationSteps = ['已投递', '企业查看', '初筛通过', '待沟通'];

const stageCopy = {
  working: { status: '成果待提交', next: '完成本次任务成果提交', action: '继续任务' },
  submitted: { status: '等待企业验收', next: '企业验收后将自动进入结算', action: '查看任务' },
  settling: { status: '结算执行中', next: '智能合约正在核验履约记录', action: '查看进度' },
  settled: { status: '已完成结算', next: '薪资已到账，实践证书已生成', action: '查看证书' },
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

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <header className={styles.contextHeader}>
        <div>
          <span className={styles.eyebrow}>学生工作台</span>
          <h1>下午好，{state.student.name}</h1>
          <p>你有 1 个待跟进的投递，1 项兼职任务正在进行。</p>
        </div>
        <div className={styles.quickEntries} aria-label="常用功能">
          {quickEntries.map((entry) => (
            <button key={entry.label} type="button" onClick={() => navigate(entry.route)}>
              <span>{entry.icon}</span>
              <span><strong>{entry.label}</strong><small>{entry.hint}</small></span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.workspaceGrid}>
        <div className={styles.primaryColumn}>
          <section className={styles.applicationPanel} aria-labelledby="application-title">
            <div className={styles.panelTopline}>
              <div>
                <span className={styles.sectionLabel}>最近投递</span>
                <h2 id="application-title">校园短视频运营助理</h2>
                <p>青禾数字传媒有限公司 · 远程协作</p>
              </div>
              <SemanticStatusTag tone="success">初筛通过</SemanticStatusTag>
            </div>

            <div className={styles.applicationTrack} aria-label="投递流程：已通过初筛，等待企业沟通">
              {applicationSteps.map((step, index) => (
                <div className={index < 3 ? styles.stepComplete : styles.stepPending} key={step}>
                  <span>{index < 3 ? <IconTickCircle /> : index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>

            <div className={styles.applicationFooter}>
              <div>
                <span>最新结果 · 今天 10:24</span>
                <strong>企业已通过简历初筛，预计 1 个工作日内联系你</strong>
              </div>
              <Button theme="light" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate('/student/applications')}>
                查看投递
              </Button>
            </div>
          </section>

          <section className={styles.currentTask} aria-labelledby="current-task-title">
            <div className={styles.taskIdentity}>
              <span className={styles.taskIcon}><IconBriefcaseStroked /></span>
              <div>
                <span className={styles.sectionLabel}>当前任务 · {state.task.id}</span>
                <h2 id="current-task-title">{state.task.title}</h2>
                <p>{state.task.enterpriseName}</p>
              </div>
            </div>
            <div className={styles.taskProgress}>
              <div><span>{taskState.status}</span><strong>{state.progress} / 10</strong></div>
              <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
              <small>{taskState.next}</small>
            </div>
            <div className={styles.taskAction}>
              <span>{formatCurrency(state.task.amount)} <small>{state.escrow.status === 'held' ? '已托管' : '已结算'}</small></span>
              <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate('/student/task')}>
                {taskState.action}
              </Button>
            </div>
          </section>
        </div>

        <aside className={styles.sideRail} aria-label="今日概览">
          <section className={styles.agenda}>
            <div className={styles.railHeading}>
              <div><span className={styles.sectionLabel}>今日待办</span><h2>接下来做什么</h2></div>
              <span>2 项</span>
            </div>
            <button type="button" onClick={() => navigate('/student/task')}>
              <span className={styles.agendaMarker} />
              <span><strong>{taskState.action}</strong><small>{taskState.next}</small></span>
              <IconArrowRight />
            </button>
            <button type="button" onClick={() => navigate('/student/messages')}>
              <span className={`${styles.agendaMarker} ${styles.neutralMarker}`} />
              <span><strong>跟进最新投递</strong><small>初筛已通过，可提前准备沟通</small></span>
              <IconArrowRight />
            </button>
          </section>

          <section className={styles.protectionSummary}>
            <div className={styles.railHeading}>
              <div><span className={styles.sectionLabel}>权益概览</span><h2>保障状态</h2></div>
              <IconShieldStroked />
            </div>
            <dl>
              <div><dt>薪资保障</dt><dd>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '已托管' : '已到账'}</dd></div>
              <div><dt>可信记录</dt><dd>{state.latestEvidence.id}</dd></div>
              <div><dt>实践信用</dt><dd>{state.student.creditLevel}</dd></div>
            </dl>
            <button type="button" onClick={() => navigate('/student/task')}>
              查看履约与证书 <IconArrowRight />
            </button>
          </section>
        </aside>
      </div>
    </motion.main>
  );
}
