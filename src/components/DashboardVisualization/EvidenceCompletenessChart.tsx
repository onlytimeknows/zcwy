import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { getEvidenceSegments } from '../../demo/demoScenarioVisualization';
import styles from './EvidenceCompletenessChart.module.css';

const statusLabels = {
  complete: '已完成',
  active: '当前处理中',
  pending: '待完成',
} as const;

export function EvidenceCompletenessChart() {
  const { state } = useDemoScenario();
  const segments = getEvidenceSegments(state);
  const completed = segments.filter((segment) => segment.status === 'complete').length;
  const incomplete = segments.length - completed;
  const active = segments.find((segment) => segment.status === 'active');
  const completedLabels = segments.filter((segment) => segment.status === 'complete').map((segment) => segment.label);
  const remainingLabels = segments.filter((segment) => segment.status !== 'complete').map((segment) => segment.label);

  return (
    <div className={styles.overview}>
      <div className={styles.summary}>
        <div><strong>{completed}</strong><span>/ {segments.length}</span></div>
        <div>
          <strong>证据链完整度</strong>
          <span>{active ? `当前：${active.label}` : '全部凭证已闭环'}</span>
        </div>
      </div>
      <div
        className={styles.segments}
        role="img"
        aria-label={`证据链共 ${segments.length} 项，已完成 ${completed} 项，${incomplete} 项尚未完成`}
      >
        {segments.map((segment) => (
          <span
            className={styles[segment.status]}
            key={segment.id}
            title={`${segment.label}：${statusLabels[segment.status]}`}
          />
        ))}
      </div>
      <div className={styles.meta}>
        <p><strong>已形成</strong><span>{completedLabels.join(' · ')}</span></p>
        <p><strong>待完成</strong><span>{remainingLabels.length ? remainingLabels.join(' · ') : '全部证据已闭环'}</span></p>
      </div>
    </div>
  );
}
