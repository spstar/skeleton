import { BrowserRouter, useRoutes } from 'react-router-dom';
import routeConfigs from './config';

function Routes() {
  return useRoutes(routeConfigs);
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
