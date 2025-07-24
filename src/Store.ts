type ValueUpdater<T> = T | ((v: T) => T);
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

  selector<Fns extends ((s: S) => any)[], R = unknown>(
    selectors: Readonly<Fns>,
    computed: (
      ...args: {
        [x in keyof Fns]: ReturnType<Fns[x]>;
      }
    ) => R
  ): (s?: S) => R {
    // 每个 selector 都有自己的缓存，通过闭包保存
    let cache: {
      args: { [x in keyof Fns]: ReturnType<Fns[x]> } | null;
      result: R;
    } | null = null;

    return (s = this.state) => {
      // 计算当前 selectors 的结果
      const currentArgs = selectors.map((fn) => fn(s)) as {
        [x in keyof Fns]: ReturnType<Fns[x]>;
      };

      // 检查缓存是否存在且参数是否相同
      if (cache && cache.args) {
        let argsChanged = false;
        
        // 比较每个参数是否变化
        for (let i = 0; i < currentArgs.length; i++) {
          if (cache.args[i] !== currentArgs[i]) {
            argsChanged = true;
            break;
          }
        }
        
        // 如果参数没有变化，返回缓存结果
        if (!argsChanged) {
          return cache.result;
        }
      }

      // 计算新结果并更新缓存
      const result = computed(...currentArgs);
      cache = {
        args: currentArgs,
        result
      };

      return result;
    };
  }
}
