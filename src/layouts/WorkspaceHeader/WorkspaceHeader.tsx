import Button from '@douyinfe/semi-ui/lib/es/button';
import { useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import { UserMenu } from '../../components/UserMenu/UserMenu';
import styles from './WorkspaceHeader.module.css';

interface WorkspaceNavItem {
  label: string;
  target: string;
}

const workspaceNav: Record<DemoRole, WorkspaceNavItem[]> = {
  student: [
    { label: '工作台', target: 'workspace-overview' },
    { label: '当前任务', target: 'current-task' },
    { label: '履约记录', target: 'evidence-overview' },
    { label: '薪资与证书', target: 'escrow-flow' },
    { label: '权益保障', target: 'deliverable-section' },
  ],
  enterprise: [
    { label: '工作台', target: 'workspace-overview' },
    { label: '当前任务', target: 'current-task' },
    { label: '成果验收', target: 'acceptance-section' },
    { label: '结算管理', target: 'escrow-flow' },
    { label: '权益保障', target: 'evidence-overview' },
  ],
};

export function WorkspaceHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useDemoAuth();
  const routeRole: DemoRole = location.pathname.startsWith('/enterprise') ? 'enterprise' : 'student';
  const currentRole = routeRole;
  const [activeTarget, setActiveTarget] = useState('workspace-overview');

  const goToSection = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    setActiveTarget(target);
    document.getElementById(target)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact />
        </button>
        <nav className={styles.nav} aria-label={`${currentRole === 'student' ? '学生' : '企业'}工作区导航`}>
          {workspaceNav[currentRole].map((item, index) => (
            <a
              className={activeTarget === item.target ? styles.active : undefined}
              href={`#${item.target}`}
              aria-current={activeTarget === item.target ? (index === 0 ? 'page' : 'location') : undefined}
              key={item.target}
              onClick={(event) => goToSection(event, item.target)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.account}>
          <span>{currentRole === 'student' ? '学生端' : '企业端'}</span>
          {role ? (
            <UserMenu showScenarioControls displayRole={currentRole} />
          ) : (
            <Button theme="light" type="primary" onClick={() => navigate('/auth')}>选择身份</Button>
          )}
        </div>
      </div>
    </header>
  );
}
