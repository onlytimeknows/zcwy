import type { JourneyPhase } from '../../types/platform';
import styles from './StageSwitcher.module.css';

interface StageSwitcherProps {
  phases: JourneyPhase[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function StageSwitcher({ phases, activeIndex, onChange }: StageSwitcherProps) {
  return (
    <div className={styles.switcher} role="tablist" aria-label="保障阶段切换">
      {phases.map((phase, index) => (
        <button
          className={index === activeIndex ? styles.active : ''}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          key={phase.id}
          onClick={() => onChange(index)}
        >
          <span>{phase.stage}</span>
          <strong>{phase.title}</strong>
        </button>
      ))}
    </div>
  );
}
