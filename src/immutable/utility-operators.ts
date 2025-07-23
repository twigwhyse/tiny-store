/**
 * 查找具有指定 id 的对象在数组中的索引
 */
export function idIndex<T extends { id: string }>(id: string) {
  return (arr: T[]): number => arr.findIndex(t => t.id === id)
}

/**
 * 检查对象的 id 是否匹配指定值
 */
export function idIs<T extends { id: string }>(id: string): (obj: T) => boolean {
  return (obj: T): boolean => obj.id === id
}

/**
 * 管道操作，从左到右依次执行函数
 */
export function pipe<T>(...fns: ((data: T) => T)[]): (data: T) => T {
  return (data: T): T => {
    return fns.reduce((acc, fn) => fn(acc), data);
  };
}

/**
 * 组合操作，从右到左依次执行函数
 */
export function compose<T>(...fns: ((data: T) => T)[]): (data: T) => T {
  return (data: T): T => {
    return fns.reduceRight((acc, fn) => fn(acc), data);
  };
} 