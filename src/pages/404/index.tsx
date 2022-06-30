import React from 'react';
import {useTranslation} from 'react-i18next';
import './index.less';

function NotFound() {
  const {t} = useTranslation();

  return (
    <div className="flex items-center justify-center flex-col relative z-10 h-screen">
      <p>This page is gone!</p>
    </div>
  );
}

export default NotFound;
