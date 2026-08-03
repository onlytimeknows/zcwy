import styles from './RouteFallback.module.css';

export function RouteFallback() {
  return (
    <div className={styles.fallback} role="status" aria-label="页面加载中">
      <span />
    </div>
  );
}
