import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconChevronDown from '@douyinfe/semi-icons/lib/es/icons/IconChevronDown';
import IconChevronUp from '@douyinfe/semi-icons/lib/es/icons/IconChevronUp';
import IconTick from '@douyinfe/semi-icons/lib/es/icons/IconTick';
import { useState } from 'react';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { EvidenceCompletenessChart } from '../DashboardVisualization/EvidenceCompletenessChart';
import styles from './TaskProgressTimeline.module.css';

const { Title, Text } = Typography;

export function TaskProgressTimeline() {
  const { view } = useDemoScenario();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.panel} id="evidence-overview" aria-labelledby="timeline-title">
      <div className={styles.heading}>
        <div>
          <Text className={styles.eyebrow}>可信履约证据</Text>
          <Title heading={4} id="timeline-title">证据链概览</Title>
        </div>
        <Button
          className={styles.disclosureButton}
          theme="borderless"
          type="primary"
          icon={expanded ? <IconChevronUp /> : <IconChevronDown />}
          iconPosition="right"
          aria-expanded={expanded}
          aria-controls="evidence-timeline-detail"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? '收起证据链' : '查看完整证据链'}
        </Button>
      </div>
      <EvidenceCompletenessChart />
      {expanded && (
        <ol className={styles.timeline} id="evidence-timeline-detail">
          {view.timeline.map((item) => (
            <li
              className={`${styles.item} ${styles[item.status]}`}
              key={item.id}
              aria-label={`${item.title}，${item.status === 'complete' ? '已完成' : item.status === 'active' ? '当前处理' : '待处理'}`}
            >
              <span className={styles.marker} aria-hidden="true">
                {item.status === 'complete' ? <IconTick /> : null}
              </span>
              <div>
                <strong>
                  {item.title}
                  {item.status === 'active' && <span className={styles.currentBadge}>当前</span>}
                </strong>
                <span>{item.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
