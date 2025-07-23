import { describe, it, expect } from 'vitest'
import { add, remove } from '../immutable/common-operators'

describe('Common Operations', () => {
  describe('add', () => {
    it('should add to Set', () => {
      const set = new Set([1, 2, 3])
      const updated = add(4)(set)
      
      expect(updated).toBeInstanceOf(Set)
      expect(updated.has(4)).toBe(true)
      expect(updated.size).toBe(4)
      expect(updated).not.toBe(set)
    })

    it('should add to Array', () => {
      const arr = [1, 2, 3]
      const updated = add(4)(arr)
      
      expect(Array.isArray(updated)).toBe(true)
      expect(updated).toContain(4)
      expect(updated).toHaveLength(4)
      expect(updated).not.toBe(arr)
    })

    it('should return same Set reference when value exists', () => {
      const set = new Set([1, 2, 3])
      const updated = add(2)(set)
      
      expect(updated).toBe(set)
    })

    it('should return same Array reference when value exists', () => {
      const arr = [1, 2, 3]
      const updated = add(2)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should work with string values in Set', () => {
      const set = new Set(['a', 'b'])
      const updated = add('c')(set)
      
      expect(updated.has('c')).toBe(true)
      expect(updated.size).toBe(3)
    })

    it('should work with string values in Array', () => {
      const arr = ['a', 'b']
      const updated = add('c')(arr)
      
      expect(updated).toContain('c')
      expect(updated).toHaveLength(3)
    })
  })

  describe('remove', () => {
    it('should remove from Set by value', () => {
      const set = new Set([1, 2, 3])
      const updated = remove<number>(2)(set)
      
      expect(updated).toBeInstanceOf(Set)
      expect(updated.has(2)).toBe(false)
      expect(updated.size).toBe(2)
      expect(updated).not.toBe(set)
    })

    it('should remove from Array by value', () => {
      const arr = [1, 2, 3]
      const updated = remove<number>(2)(arr)
      
      expect(Array.isArray(updated)).toBe(true)
      expect(updated).not.toContain(2)
      expect(updated).toHaveLength(2)
      expect(updated).not.toBe(arr)
    })

    it('should remove from Set by predicate function', () => {
      const set = new Set([1, 2, 3, 4, 5])
      const updated = remove((n: number) => n % 2 === 0)(set)
      
      expect(updated.has(1)).toBe(true)
      expect(updated.has(2)).toBe(false)
      expect(updated.has(3)).toBe(true)
      expect(updated.has(4)).toBe(false)
      expect(updated.has(5)).toBe(true)
      expect(updated.size).toBe(3)
    })

    it('should remove from Array by predicate function', () => {
      const arr = [1, 2, 3, 4, 5]
      const updated = remove((n: number) => n % 2 === 0)(arr)
      
      expect(updated).toEqual([1, 3, 5])
      expect(updated).toHaveLength(3)
    })

    it('should return same Set reference when value not found', () => {
      const set = new Set([1, 2, 3])
      const updated = remove<number>(4)(set)
      
      expect(updated).toBe(set)
    })

    it('should return same Array reference when value not found', () => {
      const arr = [1, 2, 3]
      const updated = remove<number>(4)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should return same reference when no values match predicate', () => {
      const set = new Set([1, 3, 5])
      const arr = [1, 3, 5]
      
      const updatedSet = remove((n: number) => n % 2 === 0)(set)
      const updatedArr = remove((n: number) => n % 2 === 0)(arr)
      
      expect(updatedSet).toBe(set)
      expect(updatedArr).toBe(arr)
    })
  })
}) 