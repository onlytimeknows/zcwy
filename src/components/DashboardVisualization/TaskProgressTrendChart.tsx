import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { getTaskTrend } from '../../demo/demoScenarioVisualization';
import styles from './TaskProgressTrendChart.module.css';

const chartWidth = 600;
const chartHeight = 118;
const chartTop = 10;
const chartBottom = 98;
const chartInset = 10;

export function TaskProgressTrendChart() {
  const { state, view } = useDemoScenario();
  const data = getTaskTrend(state.stage);
  const xStep = (chartWidth - chartInset * 2) / (data.length - 1);
  const actualPoints = data.map((point, index) => ({
    ...point,
    x: chartInset + index * xStep,
    y: chartBottom - (point.actual / 10) * (chartBottom - chartTop),
  }));
  const planPoints = data.map((point, index) => ({
    ...point,
    x: chartInset + index * xStep,
    y: chartBottom - (point.plan / 10) * (chartBottom - chartTop),
  }));
  const actualPath = actualPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const planPath = planPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className={styles.chart}>
      <div className={styles.heading}>
        <div>
          <strong>计划与实际推进</strong>
          <span>当前差距来自后续验收与结算环节</span>
        </div>
        <div className={styles.currentValue}>
          <strong>{view.progress}</strong>
          <span>/ 10</span>
        </div>
      </div>
      <svg
        className={styles.plot}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label={`8月1日至8月5日任务计划进度最终为 10，实际进度为 ${view.progress}，当前状态为${view.stageLabel}`}
        preserveAspectRatio="none"
      >
        <line className={styles.guideLine} x1={chartInset} x2={chartWidth - chartInset} y1={chartBottom} y2={chartBottom} />
        <line className={styles.guideLine} x1={chartInset} x2={chartWidth - chartInset} y1={chartTop + 1} y2={chartTop + 1} />
        <path className={styles.planLine} d={planPath} />
        <path className={styles.actualLine} d={actualPath} />
        {actualPoints.map((point, index) => (
          <circle
            className={index === actualPoints.length - 1 ? styles.currentPoint : styles.point}
            cx={point.x}
            cy={point.y}
            key={point.date}
            r={index === actualPoints.length - 1 ? 5 : 3}
          />
        ))}
      </svg>
      <div className={styles.axis} aria-hidden="true">
        {data.map((point) => <span key={point.date}>{point.date}</span>)}
      </div>
      <div className={styles.legend}>
        <span><i className={styles.planKey} />计划进度</span>
        <span><i className={styles.actualKey} />实际进度</span>
        <strong>8/5 · {view.progress}/10 · {view.stageLabel}</strong>
      </div>
    </div>
  );
}
