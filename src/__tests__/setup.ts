// 为测试环境添加 Array.prototype.with polyfill
// 这个方法在较新的 JavaScript 版本中可用，但在某些 Node.js 版本中可能不存在

if (!Array.prototype.with) {
  Array.prototype.with = function<T>(this: T[], index: number, value: T): T[] {
    // 创建数组的浅拷贝
    const newArray = [...this]
    
    // 确保索引在有效范围内
    if (index >= 0 && index < this.length) {
      newArray[index] = value
    }
    
    return newArray
  }
} 