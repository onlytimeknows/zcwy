import Button from '@douyinfe/semi-ui/lib/es/button';
import Layout from '@douyinfe/semi-ui/lib/es/layout';
import Space from '@douyinfe/semi-ui/lib/es/space';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconHome from '@douyinfe/semi-icons/lib/es/icons/IconHome';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import styles from './MainLayout.module.css';

const { Header, Content, Footer } = Layout;

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <BrandLogo />
        <Space wrap spacing="tight">
          <Button
            theme={location.pathname === '/' ? 'light' : 'borderless'}
            icon={<IconHome />}
            onClick={() => navigate('/')}
          >
            首页
          </Button>
          <Button theme="borderless" icon={<IconHelpCircle />} disabled>
            帮助中心
          </Button>
        </Space>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <Footer className={styles.footer}>
        <span>职此无忧 Web 概念 Demo</span>
        <Tag color="blue" size="small">模拟链上环境</Tag>
      </Footer>
    </Layout>
  );
}
