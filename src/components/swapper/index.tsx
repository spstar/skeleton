import {
  CSSProperties,
  memo,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import './index.less';
import { usePersistFn } from '@/utils/hooks';
import { animate } from 'popmotion';

function noop() {}

interface StyleProps extends CSSProperties {
  '--cmp-gallery-item-spaceBetween'?: string | number;
  '--cmp-gallery-item-width'?: string | number;
}

export interface ItemType {
  key?: any;
  id?: string | number;
  className?: string;
  alt?: string;
  url?: string;

  [p: string]: any;
}

interface GalleryProps {
  items?: ItemType[];
  className?: string;
  // style?: CSSProperties;
  style?: StyleProps;
  children?: ReactNode;
  // greater than 0; default 3;
  spaceBetween?: string;
  grid?: number;
  activeIndex?: number;
  loop?: boolean;
  lazy?: boolean;
  // need lazy option true, and required greater than 1; default same to grid value
  preload?: number;
  // on click, the item will be center automatic; default false;
  focusToCenter?: boolean;
  prevBtn?: ReactNode;
  nextBtn?: ReactNode;
  sideItemRender?: (item: ItemType) => ReactElement;

  onSideChange?: (currItem: ItemType, currentIndex: number) => void;
  onImageLoadError?: (e: SyntheticEvent) => void;
  onItemClick?: (item: ItemType) => void;
}

interface InnerOptions {
  activeIndex: number;
  currActiveIndex: number;
  rangeStartIndex: number;
  rangeEndIndex: number;
}

function Gallery(props: GalleryProps) {
  const {
    items = [],
    prevBtn,
    nextBtn,
    sideItemRender,
    children,
    grid = 3,
    // activeIndex = 0,
    loop = true,
    // preload = 1,
    lazy = true,
    focusToCenter = false,
    onItemClick = noop,
    onImageLoadError = noop,
    onSideChange = noop,
    spaceBetween = '15px',
    className = '',
    style = {}
  } = props;

  const itemsLen = items?.length || 0;
  const preload =
    ((props.preload || 0) < 1 ? 1 : props.preload || 1) % itemsLen;

  // currIndex may be negative value, transform to positive
  const activeIndex = ((props.activeIndex || 0) + itemsLen) % itemsLen;

  const resetIndex = usePersistFn(function (
    cIdx: number,
    opts = {} as InnerOptions
  ): InnerOptions {
    Object.assign(opts, {
      activeIndex: loop ? preload : 0,
      currActiveIndex: (cIdx + itemsLen) % itemsLen,
      rangeStartIndex: (cIdx - (loop ? preload : 0) + itemsLen) % itemsLen,
      rangeEndIndex: (cIdx + grid + (loop ? preload : 0) + itemsLen) % itemsLen
    });

    return opts;
  });

  // initialize index;
  const innerOptions = useRef(resetIndex(activeIndex)).current;

  useMemo(() => {
    resetIndex(activeIndex, innerOptions);
  }, [activeIndex, resetIndex, innerOptions]);

  const [translateX, setTranslateX] = useState(
    getTransPos(innerOptions.activeIndex)
  );

  // const wrapperRef = useRef<HTMLDivElement>(null);
  const getRenderItems = usePersistFn(function () {
    if (!Array.isArray(items) || !items.length) {
      return [];
    }

    const currIndex = innerOptions.currActiveIndex;
    const len = items.length;
    let ret: ItemType[] = [];

    if (lazy) {
      // can't use Array.prototype.slice ; The same below
      for (let i = 0; i < grid; ++i) {
        ret[i] = items[(currIndex + i + len) % len];
      }
    } else {
      ret = [...items];
    }

    if (loop && preload > 0) {
      let prevPreloadArr = [];
      let endPreloadArr = [];

      for (let i = 0, sIdx = currIndex - preload; i < preload; ++i) {
        prevPreloadArr[i] = items[(sIdx + i + len) % len];
      }

      for (let i = 0, sIdx = currIndex + grid; i < preload; ++i) {
        endPreloadArr[i] = items[(sIdx + i + len) % len];
      }

      ret = [...prevPreloadArr, ...ret, ...endPreloadArr];
    }

    return ret;
  });

  const initItems = useMemo(() => {
    const r = getRenderItems();

    // the currActiveIndex === activeIndex when initialize;
    // innerOptions.currActiveIndex = innerOptions.activeIndex;

    return r;
  }, [getRenderItems]);
  const [renderItems, setRenderItems] = useState(initItems);

  useEffect(() => {
    if (isNaN(activeIndex)) {
      return void 0;
    }

    setTranslateX(getTransPos(innerOptions.activeIndex));
    setRenderItems(getRenderItems());
  }, [activeIndex, getRenderItems, innerOptions.activeIndex]);

  function _onItemClick(item: ItemType, idx: number) {
    // 1. if `focusToCenter ` is true process the logic
    // 2. invoke the passed click method
    if (focusToCenter) {
      const middleIdx = grid / 2;
      const isOdd = !!(grid % 2);
      let moveIdx = 0;
      const diffIdx = idx - innerOptions.activeIndex;

      if (isOdd && diffIdx !== Math.floor(middleIdx)) {
        moveIdx = diffIdx - Math.floor(middleIdx);
      } else if (!isOdd && diffIdx !== middleIdx - 1 && diffIdx !== middleIdx) {
        moveIdx = diffIdx - middleIdx + (diffIdx > middleIdx ? 0 : 1);
      }
      moveIndex(moveIdx);
    }

    onItemClick(item);
  }

  function moveIndex(step: number) {
    const cIdx = (innerOptions.currActiveIndex + step + itemsLen) % itemsLen;

    if (step === 0) {
      return false;
    }
    // loop == false && current index is the start index;
    if (!loop && cIdx < 0) {
      return false;
    }
    // else loop == false && current index is the end index;
    else if (!loop && cIdx >= itemsLen) {
      return false;
    }

    // move forward and no cross-border;
    resetIndex(cIdx, innerOptions);
    if (step < 0) {
      setRenderItems([
        ...[items[innerOptions.rangeStartIndex]],
        ...renderItems
      ]);
      setTranslateX(getTransPos(innerOptions.activeIndex - step));
    } else {
      setRenderItems([...renderItems, ...[items[innerOptions.rangeEndIndex]]]);
    }

    onSideChange(
      items[innerOptions.currActiveIndex],
      innerOptions.currActiveIndex
    );

    // after animation；
    animate({
      type: 'keyframes',
      from: innerOptions.activeIndex + (step < 0 ? -step : 0),
      to: innerOptions.activeIndex + (step < 0 ? 0 : step),
      duration: 200,
      // ease: linear,
      mass: 1,
      velocity: 100,
      onUpdate(v) {
        setTranslateX(getTransPos(v));
      },
      onComplete() {
        setRenderItems(getRenderItems());
        setTranslateX(getTransPos(innerOptions.activeIndex));
      }
    });

    return true;
  }

  function getTransPos(idx: number) {
    return `translateX(calc(var(--cmp-gallery-item-width) * -${idx})) translateZ(0)`;
  }

  function onPrevClick() {
    moveIndex(-1);
  }

  function onNextClick() {
    moveIndex(1);
  }

  return (
    <div
      style={{
        '--cmp-gallery-item-spaceBetween': spaceBetween,
        '--cmp-gallery-item-width': `calc(${
          (1 / grid) * 100
        }% + ${spaceBetween}/${grid})`,
        ...style
      }}
      className={`cmp-gallery-container ${className} `}
    >
      <div onClick={onPrevClick} className={`cmp-gallery-prev-btn`}>
        {prevBtn}
      </div>
      <div className="cmp-gallery-swiper">
        <div style={{ transform: translateX }} className="cmp-gallery-wrapper">
          {renderItems?.map((item, idx) => {
            return (
              <div
                onClick={_onItemClick.bind(null, item, idx)}
                className={`cmp-gallery-item ${item.className ?? ''} ${
                  idx >= innerOptions.activeIndex &&
                  idx < innerOptions.activeIndex + grid
                    ? `cmp-gallery-visibility cmp-visibility-${
                        idx - innerOptions.activeIndex
                      }`
                    : ''
                }`}
                key={item.key || item.id}
              >
                {sideItemRender ? (
                  sideItemRender(item)
                ) : (
                  <img
                    onError={onImageLoadError}
                    src={item.url}
                    alt={item.alt}
                  />
                )}
                {/* <img onError={onImageLoadError} src={item.url} alt={item.alt} /> */}
              </div>
            );
          })}
          {children}
        </div>
      </div>
      <div onClick={onNextClick} className={`cmp-gallery-next-btn`}>
        {nextBtn}
      </div>
    </div>
  );
}

export default memo(Gallery);
