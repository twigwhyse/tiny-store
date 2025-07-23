import { describe, it, expect } from 'vitest'
import { push, addToArray, removeFromArray, updateAt } from '../immutable/array-operators'

describe('Array Operations', () => {
  describe('push', () => {
    it('should add element to end of array', () => {
      const arr = [1, 2, 3]
      const updated = push(4)(arr)
      
      expect(updated).toEqual([1, 2, 3, 4])
      expect(updated).not.toBe(arr)
    })

    it('should work with empty array', () => {
      const arr: number[] = []
      const updated = push(1)(arr)
      
      expect(updated).toEqual([1])
    })

    it('should work with different data types', () => {
      const arr = ['a', 'b']
      const updated = push('c')(arr)
      
      expect(updated).toEqual(['a', 'b', 'c'])
    })

    it('should add even if value already exists', () => {
      const arr = [1, 2, 3]
      const updated = push(2)(arr)
      
      expect(updated).toEqual([1, 2, 3, 2])
      expect(updated).toHaveLength(4)
    })
  })

  describe('addToArray', () => {
    it('should add new element to array', () => {
      const arr = [1, 2, 3]
      const updated = addToArray(4)(arr)
      
      expect(updated).toEqual([1, 2, 3, 4])
      expect(updated).not.toBe(arr)
    })

    it('should return same reference when element already exists', () => {
      const arr = [1, 2, 3]
      const updated = addToArray(2)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should work with string arrays', () => {
      const arr = ['a', 'b']
      const updated = addToArray('c')(arr)
      
      expect(updated).toEqual(['a', 'b', 'c'])
    })

    it('should work with object arrays', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 3 }
      const arr = [obj1, obj2]
      const updated = addToArray(obj3)(arr)
      
      expect(updated).toEqual([obj1, obj2, obj3])
    })
  })

  describe('removeFromArray', () => {
    it('should remove existing element', () => {
      const arr = [1, 2, 3, 4]
      const updated = removeFromArray<number>(2)(arr)
      
      expect(updated).toEqual([1, 3, 4])
      expect(updated).not.toBe(arr)
    })

    it('should return same reference when element not found', () => {
      const arr: number[] = [1, 2, 3]
      const updated = removeFromArray<number>(4)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should remove elements matching predicate function', () => {
      const arr: number[] = [1, 2, 3, 4, 5]
      const updated = removeFromArray((n: number) => n % 2 === 0)(arr)
      
      expect(updated).toEqual([1, 3, 5])
    })

    it('should return same reference when no elements match predicate', () => {
      const arr: number[] = [1, 3, 5]
      const updated = removeFromArray((n: number) => n % 2 === 0)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should remove all matching elements', () => {
      const arr: number[] = [1, 2, 2, 3, 2, 4]
      const updated = removeFromArray<number>(2)(arr)
      
      expect(updated).toEqual([1, 3, 4])
    })

    it('should work with string predicate', () => {
      const arr = ['apple', 'banana', 'apricot', 'cherry']
      const updated = removeFromArray((s: string) => s.startsWith('ap'))(arr)
      
      expect(updated).toEqual(['banana', 'cherry'])
    })
  })

  describe('updateAt', () => {
    it('should update element at specific index', () => {
      const arr = [1, 2, 3, 4]
      const updated = updateAt<number>(1, 10)(arr)
      
      expect(updated).toEqual([1, 10, 3, 4])
      expect(updated).not.toBe(arr)
    })

    it('should update element using function updater', () => {
      const arr = [1, 2, 3, 4]
      const updated = updateAt(1, (n: number) => n * 2)(arr)
      
      expect(updated).toEqual([1, 4, 3, 4])
    })

    it('should return same reference when index is out of bounds', () => {
      const arr = [1, 2, 3]
      const updated1 = updateAt<number>(5, 10)(arr)
      const updated2 = updateAt<number>(-1, 10)(arr)
      
      expect(updated1).toBe(arr)
      expect(updated2).toBe(arr)
    })

    it('should return same reference when value unchanged', () => {
      const arr = [1, 2, 3]
      const updated = updateAt<number>(1, 2)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should return same reference when function returns same value', () => {
      const arr = [1, 2, 3]
      const updated = updateAt(1, (n: number) => n)(arr)
      
      expect(updated).toBe(arr)
    })

    it('should work with index finder function', () => {
      const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
      const findById2 = (arr: { id: number, name: string }[]) => arr.findIndex(x => x.id === 2)
      const updated = updateAt(findById2, { id: 2, name: 'updated' })(arr)
      
      expect(updated[1]).toEqual({ id: 2, name: 'updated' })
    })

    it('should work with index finder function and updater function', () => {
      const arr = [{ id: 1, value: 10 }, { id: 2, value: 20 }]
      const findById2 = (arr: { id: number, value: number }[]) => arr.findIndex(x => x.id === 2)
      const updated = updateAt(findById2, (obj: { id: number, value: number }) => ({ ...obj, value: obj.value * 2 }))(arr)
      
      expect(updated[1]).toEqual({ id: 2, value: 40 })
    })

    it('should return same reference when index finder returns invalid index', () => {
      const arr = [1, 2, 3]
      const findInvalidIndex = () => -1
      const updated = updateAt<number>(findInvalidIndex, 10)(arr)
      
      expect(updated).toBe(arr)
    })
  })
}) 