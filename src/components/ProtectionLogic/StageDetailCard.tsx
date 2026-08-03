import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconShield from '@douyinfe/semi-icons/lib/es/icons/IconShield';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { AnimatePresence, motion } from 'framer-motion';
import type { CapabilityIcon, JourneyPhase } from '../../types/platform';
import { StageSwitcher } from './StageSwitcher';
import styles from './StageDetailCard.module.css';

interface StageDetailCardProps {
  phases: JourneyPhase[];
  activeIndex: number;
  onChange: (index: number) => void;
  reduceMotion: boolean;
}

const phaseIcons: Record<CapabilityIcon, React.ReactNode> = {
  shield: <IconShield size="extra-large" />,
  chain: <IconChainStroked size="extra-large" />,
  settlement: <IconTickCircle size="extra-large" />,
};

export function StageDetailCard({
  phases,
  activeIndex,
  onChange,
  reduceMotion,
}: StageDetailCardProps) {
  const phase = phases[activeIndex];

  return (
    <div className={`${styles.panel} ${styles[phase.tone]}`}>
      <StageSwitcher phases={phases} activeIndex={activeIndex} onChange={onChange} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          className={styles.card}
          key={phase.id}
          role="tabpanel"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.26, ease: 'easeOut' }}
        >
          <div className={styles.cardTopline}>
            <span className={styles.icon}>{phaseIcons[phase.icon]}</span>
            <span className={styles.stageNumber}>{phase.stage}</span>
          </div>
          <span className={styles.eyebrow}>{phase.eyebrow}</span>
          <h3>{phase.title}</h3>
          <p>{phase.description}</p>
          <div className={styles.evidenceList}>
            {phase.evidence.map((evidence) => (
              <span key={evidence}><IconTickCircle />{evidence}</span>
            ))}
          </div>
          <div className={styles.stateNote}>
            <span>当前阶段已同步到联盟节点</span>
            <strong>概念演示状态</strong>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
