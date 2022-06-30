import React, {
  ReactNode,
  cloneElement,
  ReactElement,
  useMemo,
  useState,
  SyntheticEvent,
  CSSProperties,
  useRef,
  useEffect
} from 'react';

// function noop() {}

type ExpandKeyGroup = (string | number)[];
interface CollapseProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  collapseIcon?: ReactElement;
  defaultExpandKey?: ExpandKeyGroup | string | number;
  accordion?: boolean;
}

function Collapse({
  children,
  style,
  defaultExpandKey,
  accordion = true,
  collapseIcon,
  className
}: CollapseProps) {
  const panelList = useMemo(() => {
    return parsePanelList(children);
  }, [children]);
  const defaultExpandKeyGroup = useMemo(() => {
    if (accordion) {
      if (Array.isArray(defaultExpandKey)) {
        return defaultExpandKey[0] ? [defaultExpandKey[0]] : [];
      }

      return defaultExpandKey ? [defaultExpandKey] : [];
    }

    if (Array.isArray(defaultExpandKey)) {
      return defaultExpandKey;
    }

    return defaultExpandKey ? [defaultExpandKey] : [];
  }, [defaultExpandKey, accordion]);
  const [expandGroup, setExpandGrop] = useState<ExpandKeyGroup>(
    defaultExpandKeyGroup
  );

  function onPanelClick(key: string | number, onClick: any, e: SyntheticEvent) {
    if (accordion) {
      setExpandGrop(expandGroup[0] === key ? [] : [key]);
    } else {
      setExpandGrop(
        getPanelExpandStatus(key)
          ? expandGroup.filter((i) => i !== key)
          : [...expandGroup, key]
      );
    }

    onClick && onClick(key, e);
  }

  function getPanelExpandStatus(expandFalg: string | number) {
    // if ( typeof expandFalg === 'number') {
    //   return (expandGroup as number[]).includes(expandFalg);
    // }

    // return (expandGroup as string[]).includes(expandFalg);
    return expandGroup.includes(expandFalg);
  }

  return (
    <div style={style} className={`cmp-collapse ${className ?? ''}`}>
      {panelList.map(({ key, node, onClick, ...restProps }, idx) => {
        return cloneElement(node, {
          key,
          collapseIcon,
          ...restProps,
          onClick: onPanelClick.bind(null, key || idx, onClick),
          expand: getPanelExpandStatus(key || idx) || getPanelExpandStatus(idx)
        });
      })}
    </div>
  );
}

interface PanelProps {
  key?: string;
  children: ReactNode;
  title: string;
  className?: string;
  collapseIcon?: ReactElement;
  onClick?: (e: SyntheticEvent) => any;
  expand?: boolean;
}

function noopClick(e: SyntheticEvent) {}
// Not considered about ref forward now;
export function Panel({
  children,
  className,
  collapseIcon,
  expand,
  title,
  onClick = noopClick
}: PanelProps) {
  const refWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refWrapper.current) {
      refWrapper.current.style.height =
        (expand ? refWrapper.current.scrollHeight : 0) + 'px';
    }
  }, [expand]);

  return (
    <div className={`cmp-collapse-panel ${className ?? ''}`}>
      <h6 className="cmp-collapse-panel-header" onClick={onClick}>
        <span className="cmp-collapse-panel-title">{title}</span>
        <span
          className={`${
            expand
              ? 'cmp-collapse-panel-expanded-icon'
              : 'cmp-collapse-panel-collapsed-icon'
          }`}
        >
          {collapseIcon ? (
            cloneElement(collapseIcon, { expand })
          ) : (
            <i className="cmp-collapse-panel-icon" />
          )}
        </span>
      </h6>
      <div ref={refWrapper} className="cmp-collapse-panel-wrapper">
        <div
          className={`cmp-collapse-content ${
            expand
              ? 'cmp-collapse-expanded-panel'
              : 'cmp-collapse-collapsed-panel'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface ChildrenListType extends PanelProps {
  node: ReactElement;
}

function parsePanelList(children: ReactNode) {
  let ret: ChildrenListType[] = [];

  React.Children.map(children, (node) => {
    if (React.isValidElement(node)) {
      // null / undefined
      const key = node.key != undefined ? String(node.key) : getUniqueId();
      ret.push({
        key,
        ...node.props,
        node
      });
    }
  });

  return ret;
}

let uniqueIdSeed = 1;
function getUniqueId() {
  ++uniqueIdSeed;
  return (+new Date()).toString(36) + uniqueIdSeed.toString(36);
}

export default Collapse;
