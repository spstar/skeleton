export function randomSequence(o: any[]) {
  let ret = [...o];

  for (let i = 0, len = o.length; i < len; i++) {
    const rIdx = Math.floor(Math.random() * len);
    const tmp = ret[i];

    ret[i] = ret[rIdx];
    ret[rIdx] = tmp;
  }

  return ret;
}

export function cacheData(key: string, value: string) {
  localStorage.setItem(key, value);
}

// web3.utils.toHex is the same
export function toHexString(t: number | string) {
  const num = Number(t);

  return isNaN(num) ? NaN : '0x' + Number(t).toString(16);
}

// support  slice(-1, -2), slice(-1, 3)
// export function slice(arr: [], start: number, end?: number) {
//   // filter  null / undefined
//   if (end == undefined) {
//     return arr.slice(start);
//   }

//   if (start >= 0) {
//     return arr.slice(start, end);
//   }
//   // else if (start < 0 && end > 0) {
//   //   return arr.slice(start, end);
//   // }

//   if (end >= 0) {
//     return [...arr.slice(start), ...arr.slice(0, end)];
//   } else {
//     return arr.slice(arr.length + end, arr.length + start);
//   }
// }
