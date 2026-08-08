import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconCalendarClockStroked from '@douyinfe/semi-icons/lib/es/icons/IconCalendarClockStroked';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import { formatCurrency } from '../../demo/demoScenarioData';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { TaskProgressTrendChart } from '../DashboardVisualization/TaskProgressTrendChart';
import { SemanticStatusTag } from '../SemanticStatus/SemanticStatusTag';
import { scenarioStageTone } from '../SemanticStatus/statusToneMap';
import styles from './CurrentTaskCard.module.css';

const { Title, Text } = Typography;

export function CurrentTaskCard({ tone = 'student' }: { tone?: 'student' | 'enterprise' }) {
  const { state, view } = useDemoScenario();

  return (
    <section className={`${styles.card} ${styles[tone]}`} aria-labelledby="current-task-title">
      <div className={styles.heading}>
        <div>
          <Text className={styles.eyebrow}>当前任务 · {state.task.id}</Text>
          <Title heading={3} id="current-task-title">{state.task.title}</Title>
        </div>
        <SemanticStatusTag tone={scenarioStageTone[state.stage]}>
          {view.stageLabel}
        </SemanticStatusTag>
      </div>

      <TaskProgressTrendChart />

      <div className={styles.facts}>
        <div className={styles.verifiedFact}><IconShieldStroked /><span>企业</span><strong>{state.enterprise.verified ? '已认证' : '待认证'}</strong></div>
        <div className={styles.valueFact}><IconChainStroked /><span>薪资</span><strong>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '已托管' : '已结算'}</strong></div>
        <div><IconCalendarClockStroked /><span>周期</span><strong>{state.task.period}</strong></div>
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
