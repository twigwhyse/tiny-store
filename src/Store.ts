import { isSameArray } from "./immutable/compare";

/* eslint-disable @typescript-eslint/ban-ts-comment */
type ValueUpdater<T> = T | ((v: T) => T);
type SelectFn<S, D> = (s: S) => D;
type GetterFn<S> = <D>(fn: SelectFn<S, D>, compare?: (a: D, b: D) => boolean) => D;
type SelectorDependency<T> = {
  selector: SelectFn<any, T>;
  value: T;
  compare: (a: T, b: T) => boolean;
};
type SelectorCache<T, Args extends any[]> = {
  dependencies: SelectorDependency<any>[];
  result: T;
  args: Args;
};

export class Store<S = object> {
  protected state: S;
  private initState: S;

  constructor(defaultData: S) {
    this.initState = defaultData;
    this.state = { ...defaultData };
  }

  setState<K extends keyof S>(s: {
    [key in K]: ValueUpdater<S[key]>;
  }): void {
    this.state = { ...this.state };
    Object.entries(s).forEach(([key, value]) => {
      if (typeof value === "function") {
        // @ts-ignore
        this.state[key] = value(this.state[key]);
      } else {
        // @ts-ignore
        this.state[key] = value;
      }
    });
    this.notify();
  }

  getState(): S {
    return this.state;
  }

  getInitState(): S {
    return this.initState;
  }

  private listener: Set<(state: S) => void> = new Set();
  subscribe(fn: (state: S) => void): () => void {
    this.listener.add(fn);
    return () => void this.listener.delete(fn);
  }

  notify(): void {
    this.listener.forEach((fn) => fn(this.state));
  }

  /**
   * 创建一个选择器
   * 选择器会缓存结果，如果参数和依赖收集器的值没有变化，则返回缓存结果
   */
  selector<T, Args extends any[]>(
    fn: (get: GetterFn<S>, ...args: Args) => T
  ): (...args: Args) => T {
    let cache: SelectorCache<T, Args> | null = null;
    return (...args: Args) => {
      // 检查参数是否变化（浅比较参数数组）
      if (cache && !isSameArray(args, cache.args)) {
        cache = null;
      }

      // 如果有缓存，先检查依赖是否变化
      if (cache) {
        const currentState = this.getState();
        const dependenciesChanged = cache.dependencies.some((dep) => {
          const currentValue = dep.selector(currentState);
          return !dep.compare(currentValue, dep.value);
        });

        if (!dependenciesChanged) {
          // 依赖没有变化，返回缓存结果
          return cache.result;
        }
      }

      // 需要重新计算，收集依赖
      const dependencies: SelectorDependency<any>[] = [];
      const get: GetterFn<S> = (select, compare) => {
        const value = select(this.getState());
        dependencies.push({
          selector: select,
          value,
          compare: compare ?? Object.is,
        });
        return value;
      };

      const result = fn(get, ...args);

      // 更新缓存
      cache = {
        dependencies,
        result,
        args,
      };

      return result;
    };
  }
}
