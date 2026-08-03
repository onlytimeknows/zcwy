import IconShield from '@douyinfe/semi-icons/lib/es/icons/IconShield';
import styles from './BrandLogo.module.css';

export function BrandLogo() {
  return (
    <div className={styles.brand} aria-label="职此无忧">
      <span className={styles.mark} aria-hidden="true">
        <IconShield size="large" />
      </span>
      <span className={styles.textGroup}>
        <span className={styles.name}>职此无忧</span>
        <span className={styles.caption}>大学生兼职权益保护平台</span>
      </span>
    </div>
  );
}
