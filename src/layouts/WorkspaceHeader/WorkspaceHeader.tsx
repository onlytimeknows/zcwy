import Button from '@douyinfe/semi-ui/lib/es/button';
import IconBellStroked from '@douyinfe/semi-icons/lib/es/icons/IconBellStroked';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconChevronLeft from '@douyinfe/semi-icons/lib/es/icons/IconChevronLeft';
import IconChevronRight from '@douyinfe/semi-icons/lib/es/icons/IconChevronRight';
import IconExit from '@douyinfe/semi-icons/lib/es/icons/IconExit';
import IconHomeStroked from '@douyinfe/semi-icons/lib/es/icons/IconHomeStroked';
import IconMailStroked from '@douyinfe/semi-icons/lib/es/icons/IconMailStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import IconUserCardPhone from '@douyinfe/semi-icons/lib/es/icons/IconUserCardPhone';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import { UserMenu } from '../../components/UserMenu/UserMenu';
import styles from './WorkspaceHeader.module.css';

interface WorkspaceNavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
  end?: boolean;
}

const studentWorkspaceNav: WorkspaceNavItem[] = [
  { label: '工作台', to: '/student', icon: <IconHomeStroked />, end: true },
  { label: '找兼职', to: '/student/opportunities', icon: <IconSearchStroked /> },
  { label: '我的投递', to: '/student/applications', icon: <IconMailStroked /> },
  { label: '履约', to: '/student/tasks/JOB-2026-0801', icon: <IconBriefcaseStroked /> },
];

const studentUtilityNav: WorkspaceNavItem[] = [
  { label: '简历', to: '/student/resume', icon: <IconUserCardPhone /> },
  { label: '权益保障', to: '/student/rights', icon: <IconShieldStroked /> },
];

const enterpriseWorkspaceNav: WorkspaceNavItem[] = [
  { label: '工作台', to: '/enterprise', end: true },
  { label: '当前任务', to: '/enterprise/task' },
  { label: '成果验收', to: '/enterprise/acceptance' },
  { label: '结算管理', to: '/enterprise/settlement' },
];

function StudentRail({ collapsed, onToggleCollapsed }: { collapsed: boolean; onToggleCollapsed: () => void }) {
  const navigate = useNavigate();
  const { role, logout } = useDemoAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderItem = (item: WorkspaceNavItem) => (
    <NavLink
      className={({ isActive }) => (isActive ? styles.railActive : undefined)}
      end={item.end}
      key={`${item.label}-${item.to}`}
      title={item.label}
      to={item.to}
    >
      <span className={styles.railIcon} aria-hidden="true">{item.icon}</span>
      <span className={styles.railLabel}>{item.label}</span>
    </NavLink>
  );

  return (
    <aside className={`${styles.studentRail} ${collapsed ? styles.railCollapsed : ''}`} aria-label="学生工作区导航">
      <button
        className={styles.railToggle}
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? '展开工具栏' : '折叠工具栏'}
        title={collapsed ? '展开工具栏' : '折叠工具栏'}
        onClick={onToggleCollapsed}
      >
        {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </button>

      <div className={styles.railTop}>
        <button className={styles.railLogo} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact />
        </button>
      </div>

      <div className={`${styles.railSection} ${styles.workspaceSection}`}>
        <span className={styles.railSectionLabel}>工作区</span>
        <nav>{studentWorkspaceNav.map(renderItem)}</nav>
      </div>

      <div className={`${styles.railSection} ${styles.utilitySection}`}>
        <span className={styles.railSectionLabel}>工具</span>
        <nav>{studentUtilityNav.map(renderItem)}</nav>
      </div>

      <div className={styles.railIdentity}>
        <span className={styles.identityDot} aria-hidden="true" />
        <span><strong>林知夏</strong><small>学生演示身份</small></span>
        {role && (
          <button className={styles.logoutButton} type="button" aria-label="退出演示登录" title="退出登录" onClick={handleLogout}>
            <IconExit />
          </button>
        )}
      </div>
    </aside>
  );
}

function StudentUtilityBar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const { role } = useDemoAuth();

  return (
    <header className={`${styles.studentUtilityBar} ${collapsed ? styles.utilityBarCollapsed : ''}`}>
      <label className={styles.searchField}>
        <IconSearchStroked aria-hidden="true" />
        <input aria-label="搜索岗位或企业" autoComplete="off" placeholder="搜索岗位或企业" type="search" />
      </label>
      <div className={styles.utilityActions}>
        <Button
          theme="borderless"
          icon={<IconMailStroked />}
          aria-label="消息，1 条待处理"
          title="消息 · 1 条待处理"
          onClick={() => navigate('/student/messages')}
        />
        <span className={styles.unread} aria-hidden="true" />
        <Button theme="borderless" icon={<IconBellStroked />} aria-label="通知" title="通知" />
        {role ? <UserMenu showScenarioControls displayRole="student" /> : <Button theme="light" type="primary" onClick={() => navigate('/auth')}>选择身份</Button>}
      </div>
    </header>
  );
}

function EnterpriseHeader() {
  const navigate = useNavigate();
  const { role } = useDemoAuth();

  return (
    <header className={styles.enterpriseHeader}>
      <div className={styles.enterpriseInner}>
        <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact />
        </button>
        <nav className={styles.enterpriseNav} aria-label="企业工作区导航">
          {enterpriseWorkspaceNav.map((item) => (
            <NavLink className={({ isActive }) => (isActive ? styles.enterpriseActive : undefined)} end={item.end} key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.enterpriseAccount}>
          <span>企业端</span>
          {role ? <UserMenu showScenarioControls displayRole="enterprise" /> : <Button theme="light" type="primary" onClick={() => navigate('/auth')}>选择身份</Button>}
        </div>
      </div>
    </header>
  );
}

export function WorkspaceHeader({ collapsed = false, onToggleCollapsed = () => undefined }: { collapsed?: boolean; onToggleCollapsed?: () => void }) {
  const location = useLocation();
  const routeRole: DemoRole = location.pathname.startsWith('/enterprise') ? 'enterprise' : 'student';

  if (routeRole === 'enterprise') {
    return <EnterpriseHeader />;
  }

  return (
    <>
      <StudentRail collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      <StudentUtilityBar collapsed={collapsed} />
    </>
  );
}
