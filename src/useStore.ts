import { useDebugValue, useSyncExternalStore } from 'react'
import { Store } from './Store'

export function createUseStore<T = object>(store: Store<T>) {
  return function useStore<D>(selector: (state: T) => D): D {
    const value = useSyncExternalStore(
      store.subscribe,
      () => selector(store.getState()),
      () => selector(store.getInitState())
    )
    useDebugValue(value)
    return value
  }
}
