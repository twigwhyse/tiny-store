import type { PrimitiveData } from "./primitive";
import type { ValueUpdater } from "./update-object";

export function push<T>(value: T) {
  return (arr: T[]): T[] => {
    return [...arr, value];
  };
}

export function addToArray<T>(value: T) {
  return (arr: T[]): T[] => {
    if (arr.includes(value)) {
      return arr;
    }
    return arr.concat(value);
  };
}

export function filter<T extends PrimitiveData>(value: ValueMatcher<T>): (arr: T[]) => T[] {
  if (typeof value === "function") {
    return (arr: T[]): T[] => {
      const newArr = arr.filter((v) => value(v));
      if (newArr.length === arr.length) {
        return arr;
      }
      return newArr;
    };
  }
  return (arr: T[]): T[] => {
    const newArr = arr.filter((v) => v !== value);
    if (newArr.length === arr.length) {
      return arr;
    }
    return newArr;
  };
}

import type { ValueMatcher } from "./types";
export type { ValueMatcher };

export function removeFromArray<T extends PrimitiveData>(value: ValueMatcher<T>): (arr: T[]) => T[] {
  if (typeof value === "function") {
    return (arr: T[]): T[] => {
      const newArr = arr.filter((v) => !value(v));
      if (newArr.length === arr.length) {
        return arr;
      }
      return newArr;
    };
  }

  return (arr: T[]): T[] => {
    if (!arr.includes(value)) {
      return arr;
    }
    return arr.filter((v) => v !== value);
  };
}

export type IndexFinder<T> = number | ((arr: T[]) => number);

export function updateAt<T extends PrimitiveData>(
  index: IndexFinder<T>,
  updater: ValueUpdater<T>
): (arr: T[]) => T[] {
  if (typeof updater === 'function') {
    if (typeof index === "number") {
      return (arr: T[]): T[] => {
        if (index < 0 || index >= arr.length) return arr;
        const oldValue = arr[index]!;
        const newValue = updater(oldValue);
        if (newValue === oldValue) return arr;
        return arr.with(index, newValue)
      };
    }

    return (arr: T[]): T[] => {
      const i = index(arr);
      if (i < 0 || i >= arr.length) return arr;
      const oldValue = arr[i]!;
      const newValue = updater(oldValue);
      if (newValue === oldValue) return arr;
      return arr.with(i, newValue)
    };
  }

  if (typeof index === "function") {
    return (arr: T[]): T[] => {
      const i = index(arr);
      if (i < 0 || i >= arr.length) return arr;
      const oldValue = arr[i]!;
      if (updater === oldValue) return arr;
      return arr.with(i, updater)
    };
  }
  return (arr: T[]): T[] => {
    if (index < 0 || index >= arr.length) return arr;
    const oldValue = arr[index]!;
    if (updater === oldValue) return arr;
    return arr.with(index, updater)
  };
} 