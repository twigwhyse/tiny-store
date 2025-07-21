import type { PrimitiveData, PrimitiveObject } from "./primitive";
import { updateObject, type ValueUpdater } from "./update-object";

export function partial<T extends PrimitiveObject>(partialValue: {
  [x in keyof T]?: ValueUpdater<T[x]>;
}) {
  return <S extends T>(oldValue: S) => {
    return updateObject(oldValue, partialValue) as S;
  };
}

export type DeepPartial<T extends PrimitiveObject> = {
  [K in keyof T]?: T[K] extends any[]
    ? ValueUpdater<T[K]>
    : T[K] extends PrimitiveObject
    ? DeepPartial<T[K]>
    : ValueUpdater<T[K]>;
};

function deepPartialUpdater<T extends PrimitiveObject>(
  partialValue: DeepPartial<T>
): {
  [x in keyof T]?: T[x] extends object ? ValueUpdater<T[x]> : T[x];
} {
  const updater: {
    [x in keyof T]?: T[x] extends object ? ValueUpdater<T[x]> : T[x];
  } = {};
  Object.keys(partialValue).forEach((key) => {
    const value = partialValue[key as keyof T];
    if (Array.isArray(value)) {
      updater[key as keyof T] = value as any;
    } else if (typeof value === "object" && value !== null) {
      updater[key as keyof T] = partial(deepPartialUpdater(value)) as any;
    } else {
      updater[key as keyof T] = value as any;
    }
  });
  return updater;
}

export function deepPartial<T extends PrimitiveObject>(
  partialValue: DeepPartial<T>
) {
  return <S extends T>(oldValue: S): S => {
    return updateObject(oldValue, deepPartialUpdater(partialValue) as any) as S;
  };
}

export function push<T>(value: T) {
  return (arr: T[]): T[] => {
    return [...arr, value];
  };
}

export function addToSet<T>(value: T) {
  return (set: Set<T>): Set<T> => {
    if (set.has(value)) {
      return set;
    }
    return new Set(set).add(value);
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

export type ValueMatcher<T> = T | ((value: T) => boolean);

export function removeFromSet<T extends PrimitiveData>(value: ValueMatcher<T>): (set: Set<T>) => Set<T> {
  if (typeof value === "function") {
    return (set: Set<T>): Set<T> => {
      let newSet = set;
      set.forEach((v) => {
        if (value(v)) {
          if (newSet === set) {
            newSet = new Set(set);
          }
          newSet.delete(v);
        }
      });
      return newSet;
    };
  }

  return (set: Set<T>): Set<T> => {
    if (!set.has(value)) {
      return set;
    }
    const newSet = new Set(set);
    newSet.delete(value);
    return newSet;
  };
}

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

export function idIndex<T extends { id: string }>(id: string) {
  return (arr: T[]): number => arr.findIndex(t => t.id === id)
}

export function idIs<T extends { id: string }>(id: string): (obj: T) => boolean {
  return (obj: T): boolean => obj.id === id
}

export function pipe<T>(...fns: ((data: T) => T)[]): (data: T) => T {
  return (data: T): T => {
    return fns.reduce((acc, fn) => fn(acc), data);
  };
}

export function compose<T>(...fns: ((data: T) => T)[]): (data: T) => T {
  return (data: T): T => {
    return fns.reduceRight((acc, fn) => fn(acc), data);
  };
}
