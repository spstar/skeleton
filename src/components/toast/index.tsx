import React, { ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './index.less';

interface ContainerProps {
  className?: string;
  children: ReactNode;
  duration?: number;
}

function ToastElement({ className, children, duration }: ContainerProps) {
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      setTimeout(setFadeIn, duration, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${className ?? ''} cmp-toast-content ${
        fadeIn ? 'cmp-toast-animation-fade-in' : 'cmp-toast-animation-fade-out'
      }`}
    >
      {children}
    </div>
  );
}

interface ToastProps {
  className?: string;
  content: ReactNode;
  // uint ms , default 3000ms
  duration?: number;
  key?: string;
}

const domEl = document.createElement('div');
domEl.className = 'cmp-toast-wrapper';

let isFirstRenderFlag = true;
function Toast(props: ToastProps) {
  const { duration = 3000 } = props;
  const toastEl = document.createElement('div');
  const root = createRoot(toastEl);

  if (isFirstRenderFlag) {
    // document.getElementById('root')?.appendChild(domEl);
    document.body?.appendChild(domEl);
    isFirstRenderFlag = false;
  }

  toastEl.className = 'cmp-toast';
  domEl.appendChild(toastEl);
  root.render(
    createPortal(
      <ToastElement duration={duration} {...props}>
        {props.content}
      </ToastElement>,
      toastEl
    )
  );

  if (duration! > 0) {
    setTimeout(() => {
      toastEl.remove();
    }, duration + 900);
  }
}

export default Toast;
