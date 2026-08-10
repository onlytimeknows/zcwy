import Button from '@douyinfe/semi-ui/lib/es/button';
import IconBellStroked from '@douyinfe/semi-icons/lib/es/icons/IconBellStroked';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconChevronLeft from '@douyinfe/semi-icons/lib/es/icons/IconChevronLeft';
import IconChevronRight from '@douyinfe/semi-icons/lib/es/icons/IconChevronRight';
import IconExit from '@douyinfe/semi-icons/lib/es/icons/IconExit';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconHomeStroked from '@douyinfe/semi-icons/lib/es/icons/IconHomeStroked';
import IconMailStroked from '@douyinfe/semi-icons/lib/es/icons/IconMailStroked';
import IconSearchStroked from '@douyinfe/semi-icons/lib/es/icons/IconSearchStroked';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import IconUserCardPhone from '@douyinfe/semi-icons/lib/es/icons/IconUserCardPhone';
import { useEffect, useRef, useState } from 'react';
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
  { label: '工作台', to: '/enterprise', icon: <IconHomeStroked />, end: true },
  { label: '当前任务', to: '/enterprise/task', icon: <IconBriefcaseStroked /> },
  { label: '成果验收', to: '/enterprise/acceptance', icon: <IconFile /> },
  { label: '结算管理', to: '/enterprise/settlement', icon: <IconChainStroked /> },
];

const enterpriseUtilityNav: WorkspaceNavItem[] = [
  { label: '权益保障', to: '/help', icon: <IconShieldStroked /> },
];

function WorkspaceRail({ role, collapsed, onToggleCollapsed }: { role: DemoRole; collapsed: boolean; onToggleCollapsed: () => void }) {
  const navigate = useNavigate();
  const { role: authenticatedRole, logout } = useDemoAuth();
  const [isToggleAtMid, setToggleAtMid] = useState(collapsed);
  const [isToggleReturning, setToggleReturning] = useState(false);
  const toggleFrameRef = useRef<number | null>(null);
  const toggleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (toggleFrameRef.current !== null) {
      window.cancelAnimationFrame(toggleFrameRef.current);
    }

    if (collapsed) {
      setToggleAtMid(false);
      toggleFrameRef.current = window.requestAnimationFrame(() => {
        setToggleAtMid(true);
        toggleFrameRef.current = null;
      });
    } else {
      setToggleAtMid(false);
      setToggleReturning(false);
    }

    return () => {
      if (toggleFrameRef.current !== null) {
        window.cancelAnimationFrame(toggleFrameRef.current);
        toggleFrameRef.current = null;
      }
    };
  }, [collapsed]);

  useEffect(() => () => {
    if (toggleTimerRef.current !== null) {
      window.clearTimeout(toggleTimerRef.current);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggle = () => {
    if (!collapsed) {
      onToggleCollapsed();
      return;
    }

    if (isToggleReturning) {
      return;
    }

    setToggleReturning(true);
    setToggleAtMid(false);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onToggleCollapsed();
      return;
    }

    toggleTimerRef.current = window.setTimeout(() => {
      toggleTimerRef.current = null;
      onToggleCollapsed();
    }, 360);
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

  const workspaceNav = role === 'enterprise' ? enterpriseWorkspaceNav : studentWorkspaceNav;
  const utilityNav = role === 'enterprise' ? enterpriseUtilityNav : studentUtilityNav;
  const identity = role === 'enterprise'
    ? { name: '青创校园文化', description: '企业演示身份' }
    : { name: '林知夏', description: '学生演示身份' };

  return (
    <aside className={`${styles.studentRail} ${collapsed ? styles.railCollapsed : ''}`} aria-label={`${role === 'enterprise' ? '企业' : '学生'}工作区导航`}>
      <button
        className={`${styles.railToggle} ${isToggleAtMid ? styles.railToggleAtMid : ''}`}
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? '展开工具栏' : '折叠工具栏'}
        title={collapsed ? '展开工具栏' : '折叠工具栏'}
        onClick={handleToggle}
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
        <nav>{workspaceNav.map(renderItem)}</nav>
      </div>

      <div className={`${styles.railSection} ${styles.utilitySection}`}>
        <span className={styles.railSectionLabel}>工具</span>
        <nav>{utilityNav.map(renderItem)}</nav>
      </div>

      <div className={styles.railIdentity}>
        <span className={styles.identityDot} aria-hidden="true" />
        <span><strong>{identity.name}</strong><small>{identity.description}</small></span>
        {authenticatedRole && (
          <button className={styles.logoutButton} type="button" aria-label="退出演示登录" title="退出登录" onClick={handleLogout}>
            <IconExit />
          </button>
        )}
      </div>
    </aside>
  );
}

function WorkspaceUtilityBar({ role, collapsed }: { role: DemoRole; collapsed: boolean }) {
  const navigate = useNavigate();
  const { role: authenticatedRole } = useDemoAuth();

  const isEnterprise = role === 'enterprise';

  return (
    <header className={`${styles.studentUtilityBar} ${collapsed ? styles.utilityBarCollapsed : ''}`}>
      <label className={styles.searchField}>
        <IconSearchStroked aria-hidden="true" />
        <input
          aria-label={isEnterprise ? '搜索任务或学生' : '搜索岗位或企业'}
          autoComplete="off"
          placeholder={isEnterprise ? '搜索任务或学生' : '搜索岗位或企业'}
          type="search"
        />
      </label>
      <div className={styles.utilityActions}>
        <Button
          theme="borderless"
          icon={<IconMailStroked />}
          aria-label={isEnterprise ? '成果队列' : '消息，1 条待处理'}
          title={isEnterprise ? '成果队列' : '消息 · 1 条待处理'}
          onClick={() => navigate(isEnterprise ? '/enterprise/acceptance' : '/student/messages')}
        />
        <span className={styles.unread} aria-hidden="true" />
        <Button theme="borderless" icon={<IconBellStroked />} aria-label="通知" title="通知" />
        {authenticatedRole ? <UserMenu showScenarioControls displayRole={isEnterprise ? 'enterprise' : 'student'} /> : <Button theme="light" type="primary" onClick={() => navigate('/auth')}>选择身份</Button>}
      </div>
    </header>
  );
}

export function WorkspaceHeader({ collapsed = false, onToggleCollapsed = () => undefined }: { collapsed?: boolean; onToggleCollapsed?: () => void }) {
  const location = useLocation();
  const routeRole: DemoRole = location.pathname.startsWith('/enterprise') ? 'enterprise' : 'student';

  return (
    <>
      <WorkspaceRail role={routeRole} collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      <WorkspaceUtilityBar role={routeRole} collapsed={collapsed} />
    </>
  );
}
