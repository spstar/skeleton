import { Dispatch, useEffect, useMemo, useState } from 'react';
import { usePersistFn } from '@/utils/hooks';

interface CacheOptionsType {
  // filter request in specified duration time. unit 's'(second) default 5 seconds;
  throttleTime?: number;
  retryOnError?: false | number;
  forceUpdate?: boolean;
  cacheProvider?: <V>(key: string) => [V, Dispatch<V>];
}

interface FetchDataOptionsType {
  fetcher: (k: string) => Promise<any>;
  key: string;
  retryOnError?: false | number;
}

const defaultCacheOptions: CacheOptionsType = {
  throttleTime: 5,
  retryOnError: false,
  forceUpdate: false,
  cacheProvider: useCacheProvider
};

export default function useCacheFetch<D>(
  key: string,
  fetcher: (k: string) => Promise<D>,
  options: CacheOptionsType = defaultCacheOptions
) {
  const { throttleTime, retryOnError, forceUpdate } = options;
  const [cacheData, setCacheData] = useCacheProvider<D>(key);
  const [error, setError] = useState();
  const [newData, setNewData] = useState();
  const [loading, setLoading] = useState(false);
  const _fetchData = usePersistFn(() => {
    // add cmp subscribe at first;
    FetchSubscribeMap.get(key)?.add(setCacheData);

    if (!forceUpdate && FetchStatusMap.get(key)) {
      return void 0;
    }

    FetchStatusMap.set(key, true);
    setTimeout(() => FetchStatusMap.set(key, false), throttleTime! * 1000);

    setLoading(true);
    fetchData({ fetcher, key, retryOnError })
      .then((v) => {
        const isSame = compareData(key, v);

        if (forceUpdate) {
          setNewData(v);
        }

        if (!isSame) {
          FetchSubscribeMap.get(key)?.forEach((setData) => {
            setData(v);
          });
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  });

  useMemo(() => {
    if (!FetchSubscribeMap.has(key)) {
      FetchSubscribeMap.set(key, new Set());
    }
  }, [key]);
  useMemo(_fetchData, [key, _fetchData]);

  useEffect(() => {
    return () => {
      FetchSubscribeMap.get(key)?.delete(setCacheData);
    };
  }, [key, setCacheData]);

  return { data: forceUpdate ? newData : cacheData, error, loading };
}

const FetchSubscribeMap: Map<string, Set<Dispatch<any>>> = new Map();
const FetchStatusMap: Map<string, boolean> = new Map();

function fetchData({
  fetcher,
  key,
  retryOnError
}: FetchDataOptionsType): Promise<any> {
  return fetcher(key).catch((e) => {
    console.log(`fetchData:: fetcher data has an error!`, e);

    if (retryOnError && retryOnError > 0) {
      return fetchData({
        fetcher,
        key,
        retryOnError: retryOnError - 1
      });
    }
  });
}

function useCacheProvider<T>(k: string): [T, Dispatch<T>] {
  const initData: T = useMemo(() => getCache(k), [k]);
  const [ret, dispatch] = useState(initData);

  const updateCacheData: Dispatch<T> = usePersistFn(function updateCacheData(
    data: T
  ) {
    dispatch(data);
    return setCache(k, data);
  });

  return [ret, updateCacheData];
}

const setCache = function (k: string, v: any) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch (e) {
    console.warn(
      `setCache:: set data to localStorage  Key = "${k}" has an error!`,
      e
    );

    return false;
  }
};

function getCache(k: string) {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null');
  } catch (e) {
    console.warn(
      `getCache:: get data from localStorage Key = "${k}" has an error!`,
      e
    );
  }
}

function compareData(key: string, data: any) {
  const originJsonStr = localStorage.getItem(key);
  const dataJsonStr = JSON.stringify(data);

  return originJsonStr === dataJsonStr;
}
