/**
 * @description 取当前页面的根路径,打开新页面
 * @param rootPathname
 * @param pathname
 */

export function openNewPage(
  rootPathname: string,
  pathname: string,
  query?: Record<string, any>
) {
  const url = `${location.origin}${rootPathname}/#${pathname}${
    query ? objToQueryString(query) : ""
  }`;
  window.open(url);
}

/**
 * @description: 对象转query string
 * @param o Object
 * @param  needMask 是否需要query问号
 */
export const objToQueryString = (o: Record<string, any>, needMask = true) => {
  return `${needMask ? "?" : ""}${Object.entries(o)
    .reduce(
      (searchParams, [name, value]) => (
        searchParams.append(name, String(value)), searchParams
      ),
      new URLSearchParams()
    )
    .toString()}`;
};

/** @description: 生成样式 */
export function ClassNames(...rest: string[]) {
  return rest.join(" ");
}

/** @description: 生成柔和的随机颜色 */
export function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 75%)`;
}

/** @description 数字转汉字周 */
export function numToWeek(num: number) {
  return ["一", "二", "三", "四", "五", "六", "日"][num - 1];
}
/**@description 蒋两个数字化为没有公约数的形式并返回 */
export function getNoCommonDivisor(num1: number, num2: number) {
  let [a, b] = [num1, num2];
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return [num1 / a, num2 / a];
}

/** @description 获取文件后缀*/
export function urlSuffix(url: string) {
  return url.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * @param keys 取key
 * @description 取对象中的某些key
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as K))
  ) as Pick<T, K>;
}

/**
 * @description 对象字段去undefined null
 */
export const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

// 比较两个数组是否相等
export const arrayEqual = (arr1: any[], arr2: any[]) => {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};
