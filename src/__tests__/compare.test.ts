import { describe, it, expect } from 'vitest'
import { isSameArray, isSameObject } from '../immutable/compare'

describe('Compare Functions', () => {
  describe('isSameArray', () => {
    it('should return true for same array references', () => {
      const arr = [1, 2, 3]
      
      expect(isSameArray(arr, arr)).toBe(true)
    })

    it('should return true for arrays with same primitive values', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3]
      
      expect(isSameArray(arr1, arr2)).toBe(true)
    })

    it('should return false for arrays with different values', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 4]
      
      expect(isSameArray(arr1, arr2)).toBe(false)
    })

    it('should return false for arrays with different lengths', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2]
      
      expect(isSameArray(arr1, arr2)).toBe(false)
    })

    it('should return false when one array is undefined', () => {
      const arr = [1, 2, 3]
      
      expect(isSameArray(arr, undefined)).toBe(false)
      expect(isSameArray(undefined, arr)).toBe(false)
    })

    it('should return true when both arrays are undefined', () => {
      expect(isSameArray(undefined, undefined)).toBe(true)
    })

    it('should work with empty arrays', () => {
      const arr1: number[] = []
      const arr2: number[] = []
      
      expect(isSameArray(arr1, arr2)).toBe(true)
    })

    it('should work with string arrays', () => {
      const arr1 = ['a', 'b', 'c']
      const arr2 = ['a', 'b', 'c']
      const arr3 = ['a', 'b', 'd']
      
      expect(isSameArray(arr1, arr2)).toBe(true)
      expect(isSameArray(arr1, arr3)).toBe(false)
    })

    it('should work with boolean arrays', () => {
      const arr1 = [true, false, true]
      const arr2 = [true, false, true]
      const arr3 = [true, false, false]
      
      expect(isSameArray(arr1, arr2)).toBe(true)
      expect(isSameArray(arr1, arr3)).toBe(false)
    })

    it('should handle null values in arrays', () => {
      const arr1 = [1, null, 3]
      const arr2 = [1, null, 3]
      const arr3 = [1, undefined, 3]
      
      expect(isSameArray(arr1, arr2)).toBe(true)
      expect(isSameArray(arr1, arr3 as any)).toBe(false)
    })
  })

  describe('isSameObject', () => {
    it('should return true for same object references', () => {
      const obj = { a: 1, b: 2 }
      
      expect(isSameObject(obj, obj)).toBe(true)
    })

    it('should return true for objects with same primitive values', () => {
      const obj1 = { a: 1, b: 'test', c: true }
      const obj2 = { a: 1, b: 'test', c: true }
      
      expect(isSameObject(obj1, obj2)).toBe(true)
    })

    it('should return false for objects with different values', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 3 }
      
      expect(isSameObject(obj1, obj2)).toBe(false)
    })

    it('should return false for objects with different keys', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, c: 2 }
      
      expect(isSameObject(obj1, obj2 as any)).toBe(false)
    })

    it('should return false for objects with different number of keys', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 2, c: 3 }
      
      expect(isSameObject(obj1, obj2)).toBe(false)
    })

    it('should return false when one object is undefined', () => {
      const obj = { a: 1, b: 2 }
      
      expect(isSameObject(obj, undefined)).toBe(false)
      expect(isSameObject(undefined, obj)).toBe(false)
    })

    it('should return true when both objects are undefined', () => {
      expect(isSameObject(undefined, undefined)).toBe(true)
    })

    it('should work with empty objects', () => {
      const obj1 = {}
      const obj2 = {}
      
      expect(isSameObject(obj1, obj2)).toBe(true)
    })

    it('should handle null values in objects', () => {
      const obj1 = { a: null, b: 2 }
      const obj2 = { a: null, b: 2 }
      const obj3 = { a: undefined, b: 2 }
      
      expect(isSameObject(obj1, obj2)).toBe(true)
      expect(isSameObject(obj1, obj3 as any)).toBe(false)
    })

    it('should handle objects with different key orders', () => {
      const obj1 = { a: 1, b: 2, c: 3 }
      const obj2 = { c: 3, b: 2, a: 1 }
      
      expect(isSameObject(obj1, obj2)).toBe(true)
    })

    it('should work with string keys and values', () => {
      const obj1 = { name: 'Alice', city: 'NYC' }
      const obj2 = { name: 'Alice', city: 'NYC' }
      const obj3 = { name: 'Alice', city: 'LA' }
      
      expect(isSameObject(obj1, obj2)).toBe(true)
      expect(isSameObject(obj1, obj3)).toBe(false)
    })

    it('should handle boolean values', () => {
      const obj1 = { active: true, disabled: false }
      const obj2 = { active: true, disabled: false }
      const obj3 = { active: false, disabled: false }
      
      expect(isSameObject(obj1, obj2)).toBe(true)
      expect(isSameObject(obj1, obj3)).toBe(false)
    })
  })
}) 