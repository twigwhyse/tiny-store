import type { PrimitiveData } from "./primitive";
import type { ValueUpdater } from "./update-object";

import type { KeyMatcher } from "./types";

/**
 * 向 Map 中设置键值对
 */
export function setInMap<K, V>(key: K, value: V) {
  return (map: Map<K, V>): Map<K, V> => {
    if (map.has(key) && map.get(key) === value) {
      return map;
    }
    const newMap = new Map(map);
    newMap.set(key, value);
    return newMap;
  };
}

/**
 * 从 Map 中删除指定的键
 */
export function deleteFromMap<K extends PrimitiveData, V>(key: KeyMatcher<K>): (map: Map<K, V>) => Map<K, V> {
  if (typeof key === "function") {
    return (map: Map<K, V>): Map<K, V> => {
      let newMap = map;
      map.forEach((_, k) => {
        if (key(k)) {
          if (newMap === map) {
            newMap = new Map(map);
          }
          newMap.delete(k);
        }
      });
      return newMap;
    };
  }

  return (map: Map<K, V>): Map<K, V> => {
    if (!map.has(key)) {
      return map;
    }
    const newMap = new Map(map);
    newMap.delete(key);
    return newMap;
  };
}

/**
 * 更新 Map 中指定键的值
 */
export function updateInMap<K, V>(key: K, updater: ValueUpdater<V>) {
  return (map: Map<K, V>): Map<K, V> => {
    if (!map.has(key)) {
      return map;
    }

    const oldValue = map.get(key)!;
    const newValue = typeof updater === "function" ? (updater as (v: V) => V)(oldValue) : updater;
    
    if (newValue === oldValue) {
      return map;
    }

    const newMap = new Map(map);
    newMap.set(key, newValue);
    return newMap;
  };
}

/**
 * 合并两个 Map
 */
export function mergeMap<K extends string | number | symbol, V>(otherMap: Map<K, V> | Record<K, V>) {
  return (map: Map<K, V>): Map<K, V> => {
    const newMap = new Map(map);
    let hasChanges = false;

    const entries = otherMap instanceof Map ? otherMap.entries() : Object.entries(otherMap as Record<string, V>) as [K, V][];
    
    for (const [key, value] of entries) {
      if (!newMap.has(key) || newMap.get(key) !== value) {
        newMap.set(key, value);
        hasChanges = true;
      }
    }

    return hasChanges ? newMap : map;
  };
}

/**
 * 根据条件过滤 Map
 */
export function filterMap<K, V>(predicate: (value: V, key: K) => boolean) {
  return (map: Map<K, V>): Map<K, V> => {
    const newMap = new Map<K, V>();
    let hasChanges = false;

    map.forEach((value, key) => {
      if (predicate(value, key)) {
        newMap.set(key, value);
      } else {
        hasChanges = true;
      }
    });

    return hasChanges ? newMap : map;
  };
}

/**
 * 转换 Map 中的值
 */
export function mapValues<K, V, U>(transformer: (value: V, key: K) => U) {
  return (map: Map<K, V>): Map<K, U> => {
    const newMap = new Map<K, U>();
    map.forEach((value, key) => {
      newMap.set(key, transformer(value, key));
    });
    return newMap;
  };
} 