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
          const { StudentWorkspacePage } = await import('../pages/Student/StudentWorkspacePage');

          return { Component: StudentWorkspacePage };
        },
      },
      {
        path: 'student/task',
        lazy: async () => {
          const { StudentDashboardPage } = await import('../pages/Student/StudentDashboardPage');

          return { Component: StudentDashboardPage };
        },
      },
      {
        path: 'student/tasks/:taskId',
        lazy: async () => {
          const { StudentDashboardPage } = await import('../pages/Student/StudentDashboardPage');

          return { Component: StudentDashboardPage };
        },
      },
      {
        path: 'student/applications',
        lazy: async () => {
          const { StudentApplicationsPage } = await import('../pages/Student/StudentApplicationsPage');

          return { Component: StudentApplicationsPage };
        },
      },
      {
        path: 'student/applications/:applicationId',
        lazy: async () => {
          const { StudentApplicationDetailPage } = await import('../pages/Student/StudentApplicationsPage');

          return { Component: StudentApplicationDetailPage };
        },
      },
      {
        path: 'student/opportunities',
        lazy: async () => {
          const { StudentOpportunitiesPage } = await import('../pages/Student/StudentUtilityPages');

          return { Component: StudentOpportunitiesPage };
        },
      },
      {
        path: 'student/resume',
        lazy: async () => {
          const { StudentResumePage } = await import('../pages/Student/StudentUtilityPages');

          return { Component: StudentResumePage };
        },
      },
      {
        path: 'student/messages',
        lazy: async () => {
          const { StudentMessagesPage } = await import('../pages/Student/StudentUtilityPages');

          return { Component: StudentMessagesPage };
        },
      },
      {
        path: 'student/rights',
        lazy: async () => {
          const { StudentRightsPage } = await import('../pages/Student/StudentUtilityPages');

          return { Component: StudentRightsPage };
        },
      },
      {
        path: 'enterprise',
        lazy: async () => {
          const { EnterpriseWorkspacePage } = await import('../pages/Enterprise/EnterpriseWorkspacePage');

          return { Component: EnterpriseWorkspacePage };
        },
      },
      {
        path: 'enterprise/task',
        lazy: async () => {
          const { EnterpriseDashboardPage } = await import('../pages/Enterprise/EnterpriseDashboardPage');

          return { Component: EnterpriseDashboardPage };
        },
      },
      {
        path: 'enterprise/acceptance',
        lazy: async () => {
          const { EnterpriseDashboardPage } = await import('../pages/Enterprise/EnterpriseDashboardPage');

          return { Component: EnterpriseDashboardPage };
        },
      },
      {
        path: 'enterprise/settlement',
        lazy: async () => {
          const { EnterpriseDashboardPage } = await import('../pages/Enterprise/EnterpriseDashboardPage');

          return { Component: EnterpriseDashboardPage };
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
