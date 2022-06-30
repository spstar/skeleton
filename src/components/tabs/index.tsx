import React, { ReactElement, ReactNode, useMemo } from 'react';

interface TabProps {
  className?: string;
  children: ReactNode;
  defaultActiveTab?: string;
}

interface TabPanelProps {
  key: string;
  className?: string;
  tab: string;
  children: ReactNode;
}

interface TabNavProps {
  className?: string;
  children?: ReactNode;
}

export default function Tabs({ className, children }: TabProps) {
  const tabs = useMemo(() => {
    return parseTabList(children);
  }, [children]);

  return (
    <div className={`${className ?? ''} cmp-tabs`}>
      <TabNav></TabNav>
      {tabs.map((tab) => {
        return React.cloneElement(tab.node);
      })}
    </div>
  );
}

export interface Tab extends TabPanelProps {
  key: string;
  node: ReactElement;
}

export function TabNav({ className, children, ...props }: TabNavProps) {
  return <div className={`cmp-tab-nav ${className ?? ''}`}>{children}</div>;
}

export function TabPanel({ className, children, ...props }: TabPanelProps) {
  return <div className={`cmp-tab-panel ${className ?? ''}`}>{children}</div>;
}

function parseTabList(children: ReactNode): Tab[] {
  let ret: Tab[] = [];

  React.Children.map(children, (node) => {
    if (
      React.isValidElement(node) &&
      (node.type as any)['name'] === 'TabPanel'
    ) {
      const key = node.key !== undefined ? String(node.key) : undefined;
      ret.push({
        key,
        ...node.props,
        node
      });
    }
  });

  return ret;
}
