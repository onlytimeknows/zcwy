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
  const active = segments.find((segment) => segment.status === 'active');
  const incomplete = segments.length - completed;
  const waiting = incomplete - (active ? 1 : 0);

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
        <span><i className={styles.completeDot} />已完成 {completed}</span>
        {active && <span><i className={styles.activeDot} />当前 1</span>}
        <span><i className={styles.pendingDot} />待完成 {waiting}</span>
      </div>
    </div>
  );
}
