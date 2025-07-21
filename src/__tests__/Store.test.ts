import { describe, it, expect, vi } from 'vitest'
import { Store } from '../Store'

describe('Store', () => {
  it('should initialize with default state', () => {
    const store = new Store({ count: 0, name: 'test' })
    expect(store.getState()).toEqual({ count: 0, name: 'test' })
  })

  it('should update state with direct values', () => {
    const store = new Store({ count: 0, name: 'test' })
    store.setState({ count: 1 })
    expect(store.getState()).toEqual({ count: 1, name: 'test' })
  })

  it('should update state with functions', () => {
    const store = new Store({ count: 0, name: 'test' })
    store.setState({ count: (prev) => prev + 5 })
    expect(store.getState()).toEqual({ count: 5, name: 'test' })
  })

  it('should notify subscribers on state change', () => {
    const store = new Store({ count: 0 })
    const listener = vi.fn()
    
    store.subscribe(listener)
    store.setState({ count: 1 })
    
    expect(listener).toHaveBeenCalledWith({ count: 1 })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe listeners', () => {
    const store = new Store({ count: 0 })
    const listener = vi.fn()
    
    const unsubscribe = store.subscribe(listener)
    store.setState({ count: 1 })
    expect(listener).toHaveBeenCalledTimes(1)
    
    unsubscribe()
    store.setState({ count: 2 })
    expect(listener).toHaveBeenCalledTimes(1) // still 1, not called again
  })

  it('should return initial state for getInitState', () => {
    const initialState = { count: 0, name: 'test' }
    const store = new Store(initialState)
    
    store.setState({ count: 5 })
    expect(store.getInitState()).toEqual(initialState)
    expect(store.getState()).toEqual({ count: 5, name: 'test' })
  })
}) 