import Button from '@douyinfe/semi-ui/lib/es/button';
import IconMailStroked from '@douyinfe/semi-icons/lib/es/icons/IconMailStroked';
import IconUserCardPhone from '@douyinfe/semi-icons/lib/es/icons/IconUserCardPhone';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import { UserMenu } from '../../components/UserMenu/UserMenu';
import styles from './WorkspaceHeader.module.css';

interface WorkspaceNavItem {
  label: string;
  to: string;
}

const workspaceNav: Record<DemoRole, WorkspaceNavItem[]> = {
  student: [
    { label: '工作台', to: '/student' },
    { label: '找兼职', to: '/student/opportunities' },
    { label: '我的投递', to: '/student/applications' },
    { label: '履约', to: '/student/tasks/JOB-2026-0801' },
  ],
  enterprise: [
    { label: '工作台', to: '/enterprise' },
    { label: '当前任务', to: '/enterprise/task' },
    { label: '成果验收', to: '/enterprise/acceptance' },
    { label: '结算管理', to: '/enterprise/settlement' },
  ],
};

export function WorkspaceHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useDemoAuth();
  const routeRole: DemoRole = location.pathname.startsWith('/enterprise') ? 'enterprise' : 'student';
  const currentRole = routeRole;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact />
        </button>
        <nav className={styles.nav} aria-label={`${currentRole === 'student' ? '学生' : '企业'}工作区导航`}>
          {workspaceNav[currentRole].map((item, index) => (
            <NavLink
              className={({ isActive }) => isActive ? styles.active : undefined}
              end={index === 0}
              key={`${item.label}-${item.to}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.account}>
          <span>{currentRole === 'student' ? '学生端' : '企业端'}</span>
          {currentRole === 'student' && (
            <div className={styles.utilities} aria-label="学生工具">
              <Button theme="borderless" icon={<IconUserCardPhone />} aria-label="我的简历" title="我的简历" onClick={() => navigate('/student/resume')} />
              <Button theme="borderless" icon={<IconMailStroked />} aria-label="消息，1 条待处理" title="消息 · 1 条待处理" onClick={() => navigate('/student/messages')} />
              <span className={styles.unread} aria-hidden="true" />
            </div>
          )}
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
