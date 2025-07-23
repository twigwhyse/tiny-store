import type { PrimitiveData } from "./primitive";

import type { ValueMatcher } from "./types";

export function addToSet<T>(value: T) {
  return (set: Set<T>): Set<T> => {
    if (set.has(value)) {
      return set;
    }
    return new Set(set).add(value);
  };
}

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