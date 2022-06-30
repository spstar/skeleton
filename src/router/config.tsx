import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import NotFound from '@/pages/404';

const Home = loadable(() => import('@/pages/home'));

function Layout() {
  return (
      <main className="h-screen">
        <Outlet />
      </main>
  );
}

const configs: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />
      },
      {
        path: '*',
        element: <Navigate to="/" />
      }
    ]
  },
  {
    path: '/404',
    element: <NotFound />
  }
];

export default configs;
