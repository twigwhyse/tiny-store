// 类型定义
export * from "./types"

// 对象操作
export * from "./object-operators"

// 数组操作
export { push, addToArray, removeFromArray, updateAt, type IndexFinder } from "./array-operators"

// Set 操作
export * from "./set-operators"

// Map 操作
export * from "./map-operators"

// 通用操作
export * from "./common-operators"

// 工具函数
export * from "./utility-operators"

// 为了保持向后兼容，保留原有的 op 导出方式
import * as objectOps from "./object-operators"
import * as arrayOps from "./array-operators"
import * as setOps from "./set-operators"
import * as mapOps from "./map-operators"
import * as commonOps from "./common-operators"
import * as utilityOps from "./utility-operators"

export const op: typeof objectOps & typeof arrayOps & typeof setOps & typeof mapOps & typeof commonOps & typeof utilityOps = {
  ...objectOps,
  ...arrayOps,
  ...setOps,
  ...mapOps,
  ...commonOps,
  ...utilityOps,
}