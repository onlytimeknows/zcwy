import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { RouteFallback } from './RouteFallback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('../pages/Home/HomePage');

          return { Component: HomePage };
        },
      },
      {
        path: 'auth',
        lazy: async () => {
          const { AuthPage } = await import('../pages/Auth/AuthPage');

          return { Component: AuthPage };
        },
      },
      {
        path: 'demo',
        lazy: async () => {
          const { DemoPreviewPage } = await import('../pages/ModulePreview/ModulePreviewPage');

          return { Component: DemoPreviewPage };
        },
      },
      {
        path: 'student',
        lazy: async () => {
          const { StudentPreviewPage } = await import('../pages/ModulePreview/ModulePreviewPage');

          return { Component: StudentPreviewPage };
        },
      },
      {
        path: 'enterprise',
        lazy: async () => {
          const { EnterprisePreviewPage } = await import('../pages/ModulePreview/ModulePreviewPage');

          return { Component: EnterprisePreviewPage };
        },
      },
      {
        path: 'help',
        lazy: async () => {
          const { HelpPreviewPage } = await import('../pages/ModulePreview/ModulePreviewPage');

          return { Component: HelpPreviewPage };
        },
      },
    ],
  },
]);
