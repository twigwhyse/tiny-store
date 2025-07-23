import { describe, it, expect } from 'vitest'
import { updateObject } from '../immutable/update-object'

describe('updateObject', () => {
  it('should update object with direct values', () => {
    const obj = { id: 1, name: 'Alice', age: 25 }
    const updated = updateObject(obj, { name: 'Bob', age: 30 })
    
    expect(updated).toEqual({ id: 1, name: 'Bob', age: 30 })
    expect(updated).not.toBe(obj)
  })

  it('should update object with function updaters', () => {
    const obj = { id: 1, name: 'Alice', count: 5 }
    const updated = updateObject(obj, {
      name: (name: string) => name.toUpperCase(),
      count: (count: number) => count * 2
    })
    
    expect(updated).toEqual({ id: 1, name: 'ALICE', count: 10 })
    expect(updated).not.toBe(obj)
  })

  it('should return same reference when no changes are made', () => {
    const obj = { id: 1, name: 'Alice', age: 25 }
    const updated = updateObject(obj, { name: 'Alice', age: 25 })
    
    expect(updated).toBe(obj)
  })

  it('should return same reference when updater function returns same value', () => {
    const obj = { id: 1, name: 'Alice', count: 5 }
    const updated = updateObject(obj, {
      name: (name: string) => name,
      count: (count: number) => count
    })
    
    expect(updated).toBe(obj)
  })

  it('should handle partial updates', () => {
    const obj = { id: 1, name: 'Alice', age: 25, city: 'NYC' }
    const updated = updateObject(obj, { name: 'Bob' })
    
    expect(updated).toEqual({ id: 1, name: 'Bob', age: 25, city: 'NYC' })
    expect(updated).not.toBe(obj)
  })

  it('should handle mixed value and function updates', () => {
    const obj = { name: 'Alice', count: 5, active: false }
    const updated = updateObject(obj, {
      name: 'Bob',
      count: (count: number) => count + 1,
      active: true
    })
    
    expect(updated).toEqual({ name: 'Bob', count: 6, active: true })
  })

  it('should ignore keys that do not exist in original object', () => {
    const obj = { id: 1, name: 'Alice' }
    const updated = updateObject(obj, {
      name: 'Bob',
      // @ts-ignore - testing behavior with non-existing key
      nonExistingKey: 'value'
    })
    
    expect(updated).toEqual({ id: 1, name: 'Bob' })
    expect(updated).not.toBe(obj)
  })

  it('should work with empty update object', () => {
    const obj = { id: 1, name: 'Alice' }
    const updated = updateObject(obj, {})
    
    expect(updated).toBe(obj)
  })

  it('should handle null and undefined values', () => {
    const obj = { id: 1, name: 'Alice', data: null, other: undefined }
    const updated = updateObject(obj, { 
      name: 'Bob',
      data: 'some data',
      other: 'defined'
    })
    
    expect(updated).toEqual({ 
      id: 1, 
      name: 'Bob', 
      data: 'some data', 
      other: 'defined' 
    })
  })

  it('should preserve original object properties not in update', () => {
    const obj = { 
      id: 1, 
      name: 'Alice', 
      age: 25, 
      settings: { theme: 'dark' }, 
      tags: ['tag1', 'tag2'] 
    }
    
    const updated = updateObject(obj, { name: 'Bob' })
    
    expect(updated.settings).toBe(obj.settings) // same reference for unchanged objects
    expect(updated.tags).toBe(obj.tags) // same reference for unchanged arrays
    expect(updated).toEqual({ 
      id: 1, 
      name: 'Bob', 
      age: 25, 
      settings: { theme: 'dark' }, 
      tags: ['tag1', 'tag2'] 
    })
  })

  it('should handle complex function updates', () => {
    const obj = { 
      user: { name: 'Alice', score: 100 }, 
      stats: { wins: 10, losses: 5 } 
    }
    
    const updated = updateObject(obj, {
      user: (user: { name: string, score: number }) => ({ ...user, score: user.score + 50 }),
      stats: (stats: { wins: number, losses: number }) => ({ ...stats, wins: stats.wins + 1 })
    })
    
    expect(updated).toEqual({
      user: { name: 'Alice', score: 150 },
      stats: { wins: 11, losses: 5 }
    })
    expect(updated).not.toBe(obj)
    expect(updated.user).not.toBe(obj.user)
    expect(updated.stats).not.toBe(obj.stats)
  })
}) 