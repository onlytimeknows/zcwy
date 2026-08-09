import Button from '@douyinfe/semi-ui/lib/es/button';
import Layout from '@douyinfe/semi-ui/lib/es/layout';
import Space from '@douyinfe/semi-ui/lib/es/space';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconHome from '@douyinfe/semi-icons/lib/es/icons/IconHome';
import { useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { useDemoAuth } from '../../auth/DemoAuthContext';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { UserMenu } from '../../components/UserMenu/UserMenu';
import { WorkspaceHeader } from '../WorkspaceHeader/WorkspaceHeader';
import styles from './MainLayout.module.css';

const { Header, Content, Footer } = Layout;
const STUDENT_RAIL_STORAGE_KEY = 'zcwy-student-rail-collapsed-v1';

function readStudentRailPreference() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(STUDENT_RAIL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useDemoAuth();
  const [isStudentRailCollapsed, setStudentRailCollapsed] = useState(readStudentRailPreference);
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  const isWorkspacePage = location.pathname.startsWith('/student') || location.pathname.startsWith('/enterprise');
  const isStudentWorkspace = location.pathname.startsWith('/student');
  const isWorkspaceHomePage = location.pathname === '/student' || location.pathname === '/enterprise';
  const hasCompactHeader = isHomePage || isAuthPage;

  const toggleStudentRail = () => {
    setStudentRailCollapsed((current) => {
      const next = !current;

      try {
        window.localStorage.setItem(STUDENT_RAIL_STORAGE_KEY, String(next));
      } catch {
        // 浏览器禁用本地存储时，仅在当前会话保留折叠状态。
      }

      return next;
    });
  };

  const goToHomeSection = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(`/#${sectionId}`);
  };

  return (
    <Layout
      className={`${styles.layout} ${hasCompactHeader ? styles.compactLayout : ''} ${isHomePage ? styles.homeLayout : ''} ${isAuthPage ? styles.authLayout : ''} ${isWorkspacePage ? styles.workspaceLayout : ''} ${isStudentWorkspace ? styles.studentWorkspaceLayout : ''} ${isStudentWorkspace && isStudentRailCollapsed ? styles.studentRailCollapsed : ''} ${isWorkspaceHomePage ? styles.workspaceHomeLayout : ''}`}
    >
      {isWorkspacePage ? (
        <WorkspaceHeader collapsed={isStudentRailCollapsed} onToggleCollapsed={toggleStudentRail} />
      ) : (
        <Header
          className={`${styles.header} ${hasCompactHeader ? styles.compactHeader : ''} ${isHomePage ? styles.homeHeader : ''}`}
        >
          <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
            <BrandLogo compact={hasCompactHeader} />
          </button>
          <nav className={styles.nav} aria-label="主导航">
            <Button
              theme={location.pathname === '/' ? 'light' : 'borderless'}
              icon={<IconHome />}
              onClick={() => navigate('/')}
            >
              首页
            </Button>
            <Button theme="borderless" onClick={() => goToHomeSection('journey')}>
              保障逻辑
            </Button>
            <Button theme="borderless" onClick={() => goToHomeSection('modules')}>
              模块入口
            </Button>
          </nav>
          <Space spacing="tight" className={styles.actions}>
            <Button
              className={styles.helpButton}
              theme="borderless"
              icon={<IconHelpCircle />}
              aria-label="帮助中心"
              title="帮助中心"
              onClick={() => navigate('/help')}
            >
              帮助中心
            </Button>
            {role ? (
              <UserMenu />
            ) : (
              <Button
                theme="solid"
                type="primary"
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={() => navigate('/auth')}
              >
                进入平台
              </Button>
            )}
          </Space>
        </Header>
      )}

      <Content className={styles.content}>
        <Outlet />
      </Content>

      {!isAuthPage && !isWorkspacePage && (
        <Footer className={styles.footer}>
          <span>职此无忧 Web 概念 Demo</span>
          <SemanticStatusTag size="small">模拟链上环境</SemanticStatusTag>
        </Footer>
      )}
      <ScrollRestoration />
    </Layout>
  );
}
