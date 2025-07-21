import type { PrimitiveArray, PrimitiveObject } from "./primitive"

export function isSameArray<T extends PrimitiveArray>(arr1?: T, arr2?: T): boolean {
  if (Object.is(arr1, arr2)) {
    return true
  }
  if (!arr1 || !arr2) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!Object.is(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
}

export function isSameObject<T extends PrimitiveObject>(a?: T, b?: T): boolean {
  if (Object.is(a, b)) {
    return true
  }
  if (!a || !b) {
    return false
  }
  
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  
  // 先快速检查键数量
  if (keysA.length !== keysB.length) {
    return false
  }
  
  // 遍历检查每个键值对
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i] as keyof T
    if (!Object.is(a[key], b[key])) {
      return false
    }
  }
  
  return true
}