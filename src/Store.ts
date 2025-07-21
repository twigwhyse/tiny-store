/* eslint-disable @typescript-eslint/ban-ts-comment */
type ValueUpdater<T> = T | ((v: T) => T)

export class Store<T = object> {
  protected state: T
  private initState: T

  constructor(defaultData: T) {
    this.initState = defaultData
    this.state = { ...defaultData }
  }

  setState<K extends keyof T>(s: {
    [key in K]: ValueUpdater<T[key]>
  }): void {
    this.state = { ...this.state }
    Object.entries(s).forEach(([key, value]) => {
      if (typeof value === 'function') {
        // @ts-ignore
        this.state[key] = value(this.state[key])
      } else {
        // @ts-ignore
        this.state[key] = value
      }
    })
    this.state = this.computedState(this.state)
    this.notify()
  }

  getState(): T {
    return this.state
  }

  getInitState(): T {
    return this.initState
  }

  protected computedState(state: T): T {
    return state
  }

  private listener: Set<(state: T) => void> = new Set()
  subscribe(fn: (state: T) => void): () => void {
    this.listener.add(fn)
    return () => void this.listener.delete(fn)
  }

  notify(): void {
    this.listener.forEach((fn) => fn(this.state))
  }
}
