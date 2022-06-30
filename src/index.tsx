import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/assets/index.css';
import Router from './router';
import Store from 'react-elf';
import reducers from './store/reducers';
/* supports multiple languages */
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <Store reducers={reducers}/>
    <Router/>
  </>
);
