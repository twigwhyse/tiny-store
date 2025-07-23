// 扩展 Array 接口以包含 with 方法的类型声明
// 这确保 TypeScript 能正确识别 polyfill 的 with 方法

declare global {
  interface Array<T> {
    /**
     * 返回一个新数组，其中指定索引处的元素被替换为新值
     * @param index 要替换的元素的索引
     * @param value 新的值
     * @returns 包含替换元素的新数组
     */
    with(index: number, value: T): T[];
  }
}

export {};
