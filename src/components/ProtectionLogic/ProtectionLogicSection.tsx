import { useState } from 'react';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import { useReducedMotion } from 'framer-motion';
import { journeyPhases } from '../../mock/platformCapabilities';
import { TrustNetworkScene } from '../TrustNetwork/TrustNetworkScene';
import { StageDetailCard } from './StageDetailCard';
import styles from './ProtectionLogicSection.module.css';

const { Title, Paragraph, Text } = Typography;

export function ProtectionLogicSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());
  const activePhase = journeyPhases[activeIndex];

  return (
    <section
      id="journey"
      className={styles.section}
    >
      <div className={styles.heading}>
        <Text className={styles.label}>事前认证 · 事中存证 · 事后保障</Text>
        <Title heading={2}>不是多一个招聘平台，<br />而是补上兼职权益的关键一环</Title>
        <Paragraph>
          三个阶段由同一份演示状态串联，后续进入学生端或企业端时，关键操作会同步更新。
        </Paragraph>
      </div>

      <div className={styles.layout}>
        <TrustNetworkScene
          activePhase={activePhase}
          activeIndex={activeIndex}
          onStageChange={setActiveIndex}
          reduceMotion={reduceMotion}
        />
        <StageDetailCard
          phases={journeyPhases}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          reduceMotion={reduceMotion}
        />
      </div>
    </section>
  );
}
