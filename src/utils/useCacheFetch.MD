

支持功能：
1. 自动存储获取的数据（目前存储在localStorage 中）\
当第二次获取指定`key`所对应的接口数据时，会优先使用缓存内数据。当拿到最新数据后做下简单比对如果没有变化则放弃更新数据；

2. 支持指定时间内的请求过滤\
可以指定 throttleTime 过滤指定时间内的请求（默认5s）

3. 错误自动尝试刷新\
`retryOnError` 可以指定当前请求错误时重试次数, 默认不重试 `retryOnError: false`, 如需要指定重试可以给`retryOnError`一个大于0的数值；
- _默认重试只捕获请求异常导致的错误，如果请求正常返回出现内部错误时，你也希望重试，可以让`fetcher`返回一个Promise.reject 的值。这样`useCacheFetch` 内部即可捕获并重试；_

4. 强制更新，在某些情况下可能需要使用最新数据；\
通过设置`forceUpdate: true`强制使用最新数据

5. `cacheProvider` 使用缓存存储的一个扩展，**最好不要修改它**\
其作用是为了控制缓存到哪里（目前控制存储在localstorage 中）

```ts
interface CacheOptionsType {
  // filter request in specified duration time. unit 's'(second) default 5 seconds;
  throttleTime?: number;
  retryOnError?: false | number;
  forceUpdate?: boolean;
  cacheProvider?: <V>(key: string) => [V, Dispatch<V>];
}
```

使用方式：
```ts
const apiGalleryList = '/api/gallery/list?pageIndex=1&pageSize=100';

export function useGalleryData() {
  const { data } = useCacheFetch(apiGalleryList, fetchGalleryList);
  const ret = useMemo(() => {
    return Array.isArray(data) ? randomSequence(processData(data)) : [];
  }, [data]);

  function processData(data: ItemType[]) {
    return data.map((it) => ({ ...it, key: it.name }));
  }

  return ret;
}

function fetchGalleryList() {
  return axios
    .get(apiGalleryList, {
      baseURL: process.env.REACT_APP_API_BASE_URL
    })
    .then((res) => {
      if (!res?.data?.success) {
        return null;
      }

      const data = res.data.data?.rows;
      if (!Array.isArray(data)) {
        return null;
      }

      return res.data.data?.rows;
    });
}
```
