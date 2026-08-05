import Button from '@douyinfe/semi-ui/lib/es/button';
import Layout from '@douyinfe/semi-ui/lib/es/layout';
import Space from '@douyinfe/semi-ui/lib/es/space';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconHome from '@douyinfe/semi-icons/lib/es/icons/IconHome';
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import styles from './MainLayout.module.css';

const { Header, Content, Footer } = Layout;

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  const goToHomeSection = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(`/#${sectionId}`);
  };

  return (
    <Layout className={`${styles.layout} ${isAuthPage ? styles.authLayout : ''}`}>
      <Header className={`${styles.header} ${isAuthPage ? styles.authHeader : ''}`}>
        <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact={isAuthPage} />
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
          <Button
            theme="solid"
            type="primary"
            icon={<IconArrowRight />}
            iconPosition="right"
            onClick={() => navigate('/auth')}
          >
            进入平台
          </Button>
        </Space>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      {!isAuthPage && (
        <Footer className={styles.footer}>
          <span>职此无忧 Web 概念 Demo</span>
          <Tag color="blue" size="small">模拟链上环境</Tag>
        </Footer>
      )}
      <ScrollRestoration />
    </Layout>
  );
}
