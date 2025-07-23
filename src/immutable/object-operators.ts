import type { PrimitiveObject } from "./primitive";
import { updateObject, type ValueUpdater } from "./update-object";

export function partial<T extends PrimitiveObject>(partialValue: {
  [x in keyof T]?: ValueUpdater<T[x]>;
}) {
  return <S extends T>(oldValue: S): S => {
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