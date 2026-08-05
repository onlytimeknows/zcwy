import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconTick from '@douyinfe/semi-icons/lib/es/icons/IconTick';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import styles from './TaskProgressTimeline.module.css';

const { Title, Text } = Typography;

export function TaskProgressTimeline() {
  const { view } = useDemoScenario();

  return (
    <section className={styles.panel} aria-labelledby="timeline-title">
      <div className={styles.heading}>
        <Text className={styles.eyebrow}>可信履约轨迹</Text>
        <Title heading={4} id="timeline-title">关键节点连续留痕</Title>
      </div>
      <ol className={styles.timeline}>
        {view.timeline.map((item) => (
          <li
            className={`${styles.item} ${styles[item.status]}`}
            key={item.id}
          >
            <span className={styles.marker} aria-hidden="true">
              {item.status === 'complete' ? <IconTick /> : null}
            </span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
            <span className={styles.statusText}>
              {item.status === 'complete' ? '已完成' : item.status === 'active' ? '当前' : '待处理'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
