import { useState, type CSSProperties } from 'react';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import { AnimatePresence, motion } from 'framer-motion';
import { journeyPhases, trustNetworkConnections, trustNetworkNodes } from '../../mock/platformCapabilities';
import type { JourneyPhase, TrustNodeId } from '../../types/platform';
import { NetworkNodeTooltip } from './NetworkNodeTooltip';
import styles from './TrustNetworkScene.module.css';

interface TrustNetworkSceneProps {
  activePhase: JourneyPhase;
  activeIndex: number;
  onStageChange: (index: number) => void;
  reduceMotion: boolean;
}

type PositionedStyle = CSSProperties & {
  '--node-x'?: string;
  '--node-y'?: string;
};

export function TrustNetworkScene({
  activePhase,
  activeIndex,
  onStageChange,
  reduceMotion,
}: TrustNetworkSceneProps) {
  const [visibleTooltip, setVisibleTooltip] = useState<TrustNodeId | null>(null);

  return (
    <motion.div
      className={styles.scene}
      aria-label="可信联盟网络互动示意"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.48, ease: 'easeOut' }}
    >
      <div className={styles.sceneHeader}>
        <div>
          <span className={styles.sceneEyebrow}>TRUSTED ALLIANCE NETWORK</span>
          <strong>可信联盟网络</strong>
        </div>
        <Tag color="blue">4 个模拟联盟节点</Tag>
      </div>

      <svg className={styles.connectionLayer} viewBox="0 0 100 100" aria-hidden="true">
        {trustNetworkConnections.map((connection) => {
          const isActive = connection.activePhases.includes(activePhase.id);

          return (
            <motion.path
              key={connection.id}
              className={isActive ? styles.connectionActive : styles.connection}
              d={connection.path}
              vectorEffect="non-scaling-stroke"
              animate={{ opacity: isActive ? 1 : 0.38 }}
              transition={{ duration: reduceMotion ? 0 : 0.26 }}
            />
          );
        })}
        <path
          className={styles.flowPath}
          d="M 18 80 C 29 86, 38 88, 48 86 S 68 78, 78 76"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          className={styles.flowPathActive}
          d="M 18 80 C 29 86, 38 88, 48 86 S 68 78, 78 76"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: (activeIndex + 1) / journeyPhases.length }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
        />
      </svg>

      <div className={styles.nodeLayer}>
        {trustNetworkNodes.map((node) => {
          const isActive = node.activePhases.includes(activePhase.id);
          const style: PositionedStyle = {
            '--node-x': `${node.position.x}%`,
            '--node-y': `${node.position.y}%`,
          };

          return (
            <div className={styles.nodeAnchor} style={style} key={node.id}>
              <button
                className={`${styles.nodeButton} ${isActive ? styles.nodeActive : ''}`}
                type="button"
                aria-describedby={visibleTooltip === node.id ? `network-tooltip-${node.id}` : undefined}
                aria-label={`查看${node.label}信息`}
                onMouseEnter={() => setVisibleTooltip(node.id)}
                onMouseLeave={() => setVisibleTooltip(null)}
                onFocus={() => setVisibleTooltip(node.id)}
                onBlur={() => setVisibleTooltip(null)}
                onClick={() => setVisibleTooltip(node.id)}
              >
                <span className={styles.nodeDot} />
                <span>{node.label}</span>
              </button>
              <AnimatePresence>
                {visibleTooltip === node.id && (
                  <NetworkNodeTooltip
                    node={node}
                    side={node.position.x > 55 ? 'left' : 'right'}
                    reduceMotion={reduceMotion}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {journeyPhases.map((phase, index) => {
          const style: PositionedStyle = {
            '--node-x': `${phase.checkpoint.x}%`,
            '--node-y': `${phase.checkpoint.y}%`,
          };

          return (
            <button
              className={`${styles.checkpoint} ${index === activeIndex ? styles.checkpointActive : ''}`}
              style={style}
              type="button"
              key={phase.id}
              aria-pressed={index === activeIndex}
              onClick={() => onStageChange(index)}
            >
              <span>{phase.stage}</span>
              <strong>{phase.title}</strong>
            </button>
          );
        })}
      </div>

      <span className={styles.conceptLabel}>模拟联盟链拓扑 · 概念演示数据</span>
    </motion.div>
  );
}
