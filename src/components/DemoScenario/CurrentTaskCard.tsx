import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCalendarClockStroked from '@douyinfe/semi-icons/lib/es/icons/IconCalendarClockStroked';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../demo/demoScenarioData';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { TaskProgressTrendChart } from '../DashboardVisualization/TaskProgressTrendChart';
import styles from './CurrentTaskCard.module.css';

const { Title, Text } = Typography;

export function CurrentTaskCard({ tone = 'student' }: { tone?: 'student' | 'enterprise' }) {
  const { state, view } = useDemoScenario();
  const location = useLocation();
  const navigate = useNavigate();
  const actionRoute = view.guide.actionRoute === '/student'
    ? `/student/tasks/${state.task.id}`
    : view.guide.actionRoute === '/enterprise'
      ? '/enterprise/task'
      : undefined;
  const showCrossRoleAction = view.guide.actionRoute && !location.pathname.startsWith(view.guide.actionRoute);

  return (
    <section className={`${styles.card} ${styles[tone]}`} id="current-task" aria-labelledby="current-task-title">
      <div className={styles.heading}>
        <div>
          <Text className={styles.eyebrow}>当前任务 · {state.task.id}</Text>
          <Title heading={3} id="current-task-title">{state.task.title}</Title>
        </div>
      </div>

      <TaskProgressTrendChart />

      <div className={styles.facts}>
        <div className={styles.verifiedFact}><IconShieldStroked /><span>企业 · {state.enterprise.verified ? '已认证' : '待认证'}</span><strong>{state.task.enterpriseName}</strong></div>
        <div className={styles.valueFact}><IconChainStroked /><span>薪资</span><strong>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '已托管' : '已结算'}</strong></div>
        <div><IconCalendarClockStroked /><span>周期</span><strong>{state.task.period}</strong></div>
      </div>

      <div className={styles.nextStep} aria-live="polite">
        <div>
          <span>当前状态</span>
          <strong>{view.stageLabel}</strong>
        </div>
        <div className={styles.nextStepCopy}>
          <span>下一步</span>
          <strong>{view.guide.hint}</strong>
        </div>
        {showCrossRoleAction && (
          <Button
            theme="light"
            type="primary"
            icon={<IconArrowRight />}
            iconPosition="right"
            onClick={() => navigate(actionRoute!)}
          >
            {view.guide.actionLabel}
          </Button>
        )}
      </div>

      <div className={styles.evidence}>
        <div>
          <span>最近一次模拟存证</span>
          <strong>{state.latestEvidence.id}</strong>
        </div>
        <code title={state.latestEvidence.hash}>{state.latestEvidence.hash}</code>
      </div>
      <Text className={styles.notice}>模拟链上环境 · 概念演示数据</Text>
    </section>
  );
}
