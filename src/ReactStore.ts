import { Store } from './Store'
import { createUseStore } from './useStore'

export class ReactStore<T = object> extends Store<T> {
  constructor(state: T) {
    super(state)
    this.subscribe = this.subscribe.bind(this)
  }
  use: ReturnType<typeof createUseStore<T>> = createUseStore(this)
}
