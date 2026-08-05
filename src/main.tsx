import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfigProvider from '@douyinfe/semi-ui/lib/es/configProvider';
import zhCN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { DemoScenarioProvider } from './demo/DemoScenarioContext';
import { router } from './routes/router';
import './styles/variables.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <DemoScenarioProvider>
        <RouterProvider router={router} />
      </DemoScenarioProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
