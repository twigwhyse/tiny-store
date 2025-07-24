import type { PrimitiveData } from "./primitive";
import type { ValueUpdater } from "./update-object";
import type { KeyMatcher } from "./types";

/**
 * 向 Record 中设置键值对
 */
export function setInRecord<T extends Record<string, any>>(key: string, value: any) {
  return (record: T): T => {
    if (record[key] === value) {
      return record;
    }
    return { ...record, [key]: value } as T;
  };
}

/**
 * 从 Record 中删除指定的键
 */
export function deleteFromRecord<T extends Record<string, any>>(key: KeyMatcher<string>): (record: T) => T {
  if (typeof key === "function") {
    return (record: T): T => {
      const newRecord = { ...record };
      let hasChanges = false;
      
      Object.keys(record).forEach((k) => {
        if (key(k)) {
          delete newRecord[k];
          hasChanges = true;
        }
      });
      
      return hasChanges ? (newRecord as T) : record;
    };
  }

  return (record: T): T => {
    if (!(key in record)) {
      return record;
    }
    const { [key]: deleted, ...newRecord } = record;
    return newRecord as T;
  };
}

/**
 * 更新 Record 中指定键的值
 */
export function updateInRecord<T extends Record<string, any>>(key: string, updater: ValueUpdater<any>) {
  return (record: T): T => {
    if (!(key in record)) {
      return record;
    }

    const oldValue = record[key];
    const newValue = typeof updater === "function" ? (updater as (v: any) => any)(oldValue) : updater;
    
    if (newValue === oldValue) {
      return record;
    }

    return { ...record, [key]: newValue } as T;
  };
}

/**
 * 合并两个 Record
 */
export function mergeRecord<T extends Record<string, any>>(otherRecord: Record<string, any>) {
  return (record: T): T => {
    let hasChanges = false;
    const newRecord: Record<string, any> = { ...record };

    Object.entries(otherRecord).forEach(([key, value]) => {
      if (!(key in newRecord) || newRecord[key] !== value) {
        newRecord[key] = value;
        hasChanges = true;
      }
    });

    return hasChanges ? (newRecord as T) : record;
  };
}

/**
 * 根据条件过滤 Record
 */
export function filterRecord<T extends Record<string, any>>(predicate: (value: any, key: string) => boolean) {
  return (record: T): T => {
    const newRecord: Record<string, any> = {};
    let hasChanges = false;

    Object.entries(record).forEach(([key, value]) => {
      if (predicate(value, key)) {
        newRecord[key] = value;
      } else {
        hasChanges = true;
      }
    });

    return hasChanges ? (newRecord as T) : record;
  };
}

/**
 * 转换 Record 中的值
 */
export function mapRecordValues<T extends Record<string, any>, U>(transformer: (value: any, key: string) => U) {
  return (record: T): Record<string, U> => {
    const newRecord = {} as Record<string, U>;
    Object.entries(record).forEach(([key, value]) => {
      newRecord[key] = transformer(value, key);
    });
    return newRecord;
  };
}

/**
 * 根据键列表选择 Record 中的部分字段
 */
export function pickFromRecord<T extends Record<string, any>, K extends keyof T>(keys: K[]) {
  return (record: T): Pick<T, K> => {
    const newRecord: Record<string, any> = {};
    keys.forEach((key) => {
      if (key in record) {
        newRecord[key as string] = record[key];
      }
    });
    return newRecord as Pick<T, K>;
  };
}

/**
 * 从 Record 中排除指定的键
 */
export function omitFromRecord<T extends Record<string, any>, K extends keyof T>(keys: K[]) {
  return (record: T): Omit<T, K> => {
    const newRecord = { ...record };
    keys.forEach((key) => {
      delete newRecord[key];
    });
    return newRecord as Omit<T, K>;
  };
}
