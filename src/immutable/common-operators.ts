import type { PrimitiveData } from "./primitive";
import { addToArray, removeFromArray, type ValueMatcher } from "./array-operators";
import { addToSet, removeFromSet } from "./set-operators";

/**
 * 通用的添加操作，自动识别数组或 Set
 */
export function add<T>(value: T): {
  (data: Set<T>): Set<T>;
  (data: T[]): T[];
} {
  return function (data: Set<T> | T[]): any {
    if (data instanceof Set) {
      return addToSet(value)(data);
    }
    return addToArray(value)(data);
  };
}

/**
 * 通用的删除操作，自动识别数组或 Set
 */
export function remove<T extends PrimitiveData>(value: ValueMatcher<T>): {
  (data: Set<T>): Set<T>;
  (data: T[]): T[];
} {
  if (typeof value === "function") {
    return (arr: T[] | Set<T>): T[] | any => {
      if (arr instanceof Set) {
        return removeFromSet(value)(arr);
      }
      return removeFromArray(value)(arr);
    };
  }

  return function (data: Set<T> | T[]): any {
    if (data instanceof Set) {
      return removeFromSet(value)(data);
    }
    return removeFromArray(value)(data);
  };
} 