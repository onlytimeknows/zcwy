import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfigProvider from '@douyinfe/semi-ui/lib/es/configProvider';
import zhCN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { DemoAuthProvider } from './auth/DemoAuthContext';
import { DemoScenarioProvider } from './demo/DemoScenarioContext';
import { router } from './routes/router';
import './styles/variables.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <DemoAuthProvider>
        <DemoScenarioProvider>
          <RouterProvider router={router} />
        </DemoScenarioProvider>
      </DemoAuthProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
