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
  const points = data.map((point, index) => ({
    ...point,
    x: chartInset + index * xStep,
    y: chartBottom - (point.value / 10) * (chartBottom - chartTop),
  }));
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? chartWidth - chartInset} ${chartBottom} L ${chartInset} ${chartBottom} Z`;

  return (
    <div className={styles.chart}>
      <div className={styles.heading}>
        <div>
          <strong>任务推进趋势</strong>
          <span>关键履约节点累计完成</span>
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
        aria-label={`8月1日至8月5日任务进度趋势，当前进度 ${view.progress} / 10`}
        preserveAspectRatio="none"
      >
        <line className={styles.guideLine} x1={chartInset} x2={chartWidth - chartInset} y1={chartBottom} y2={chartBottom} />
        <line className={styles.guideLine} x1={chartInset} x2={chartWidth - chartInset} y1={chartTop + 1} y2={chartTop + 1} />
        <path className={styles.area} d={areaPath} />
        <path className={styles.line} d={linePath} />
        {points.map((point, index) => (
          <circle
            className={index === points.length - 1 ? styles.currentPoint : styles.point}
            cx={point.x}
            cy={point.y}
            key={point.date}
            r={index === points.length - 1 ? 5 : 3}
          />
        ))}
      </svg>
      <div className={styles.axis} aria-hidden="true">
        {data.map((point) => <span key={point.date}>{point.date}</span>)}
      </div>
    </div>
  );
}
