import Tag from '@douyinfe/semi-ui/lib/es/tag';
import type { ReactNode } from 'react';
import styles from './SemanticStatusTag.module.css';

export type SemanticTone = 'neutral' | 'brand' | 'success' | 'value' | 'record' | 'attention';

interface SemanticStatusTagProps {
  children: ReactNode;
  tone?: SemanticTone;
  size?: 'small' | 'large';
  prefixIcon?: ReactNode;
  className?: string;
}

export function SemanticStatusTag({
  children,
  tone = 'neutral',
  size,
  prefixIcon,
  className = '',
}: SemanticStatusTagProps) {
  return (
    <Tag
      className={`${styles.tag} ${styles[tone]} ${className}`.trim()}
      size={size}
      prefixIcon={prefixIcon}
    >
      {children}
    </Tag>
  );
}
