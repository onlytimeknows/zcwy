import { motion } from 'framer-motion';
import type { TrustNetworkNode } from '../../types/platform';
import styles from './NetworkNodeTooltip.module.css';

interface NetworkNodeTooltipProps {
  node: TrustNetworkNode;
  side: 'left' | 'right';
  reduceMotion: boolean;
}

export function NetworkNodeTooltip({ node, side, reduceMotion }: NetworkNodeTooltipProps) {
  return (
    <motion.div
      id={`network-tooltip-${node.id}`}
      className={`${styles.tooltip} ${styles[side]}`}
      role="tooltip"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <strong>{node.label}</strong>
      <dl>
        <div>
          <dt>状态</dt>
          <dd>{node.status}</dd>
        </div>
        <div>
          <dt>职责</dt>
          <dd>{node.responsibility}</dd>
        </div>
      </dl>
    </motion.div>
  );
}
