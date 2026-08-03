import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('../pages/Home/HomePage');

          return { Component: HomePage };
        },
      },
    ],
  },
]);
