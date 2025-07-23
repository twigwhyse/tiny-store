import { describe, it, expect } from 'vitest'
import { addToSet, removeFromSet } from '../immutable/set-operators'

describe('Set Operations', () => {
  describe('addToSet', () => {
    it('should add new value to set', () => {
      const set = new Set([1, 2, 3])
      const updated = addToSet(4)(set)
      
      expect(updated.has(4)).toBe(true)
      expect(updated.size).toBe(4)
      expect(updated).not.toBe(set) // should be new set
    })

    it('should return same reference when value already exists', () => {
      const set = new Set([1, 2, 3])
      const updated = addToSet(2)(set)
      
      expect(updated).toBe(set) // should return same reference
      expect(updated.size).toBe(3)
    })

    it('should work with string values', () => {
      const set = new Set(['a', 'b', 'c'])
      const updated = addToSet('d')(set)
      
      expect(updated.has('d')).toBe(true)
      expect(updated.size).toBe(4)
      expect(updated).not.toBe(set)
    })

    it('should work with object values', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 3 }
      const set = new Set([obj1, obj2])
      const updated = addToSet(obj3)(set)
      
      expect(updated.has(obj3)).toBe(true)
      expect(updated.size).toBe(3)
    })
  })

  describe('removeFromSet', () => {
    it('should remove existing value', () => {
      const set = new Set([1, 2, 3])
      const updated = removeFromSet<number>(2)(set)
      
      expect(updated.has(2)).toBe(false)
      expect(updated.size).toBe(2)
      expect(updated).not.toBe(set)
    })

    it('should return same reference when value not found', () => {
      const set = new Set([1, 2, 3])
      const updated = removeFromSet<number>(4)(set)
      
      expect(updated).toBe(set) // should return same reference
      expect(updated.size).toBe(3)
    })

    it('should remove values matching function predicate', () => {
      const set = new Set<number>([1, 2, 3, 4, 5])
      const updated = removeFromSet((n: number) => n % 2 === 0)(set)
      
      expect(updated.has(1)).toBe(true)
      expect(updated.has(2)).toBe(false)
      expect(updated.has(3)).toBe(true)
      expect(updated.has(4)).toBe(false)
      expect(updated.has(5)).toBe(true)
      expect(updated.size).toBe(3)
    })

    it('should work with string predicate function', () => {
      const set = new Set<string>(['apple', 'banana', 'apricot'])
      const updated = removeFromSet((str: string) => str.startsWith('ap'))(set)
      
      expect(updated.has('banana')).toBe(true)
      expect(updated.has('apple')).toBe(false)
      expect(updated.has('apricot')).toBe(false)
      expect(updated.size).toBe(1)
    })

    it('should return same reference when no values match predicate', () => {
      const set = new Set<number>([1, 3, 5])
      const updated = removeFromSet((n: number) => n % 2 === 0)(set)
      
      expect(updated).toBe(set)
      expect(updated.size).toBe(3)
    })
  })
}) 