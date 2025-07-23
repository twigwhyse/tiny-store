import { describe, it, expect } from 'vitest'
import { setInMap, deleteFromMap, updateInMap, mergeMap, filterMap, mapValues } from '../immutable/map-operators'

describe('Map Operations', () => {
  describe('setInMap', () => {
    it('should set new key-value pair', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = setInMap('c', 3)(map)
      
      expect(updated.get('c')).toBe(3)
      expect(updated.size).toBe(3)
      expect(updated).not.toBe(map) // should be new map
    })

    it('should return same reference when setting existing value', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = setInMap('a', 1)(map)
      
      expect(updated).toBe(map) // should return same reference
    })

    it('should update existing key with new value', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = setInMap('a', 10)(map)
      
      expect(updated.get('a')).toBe(10)
      expect(updated.get('b')).toBe(2)
      expect(updated).not.toBe(map)
    })
  })

  describe('deleteFromMap', () => {
    it('should delete existing key', () => {
      const map = new Map<string, number>([['a', 1], ['b', 2], ['c', 3]])
      const updated = deleteFromMap('b' as string)(map)
      
      expect(updated.has('b')).toBe(false)
      expect(updated.size).toBe(2)
      expect(updated).not.toBe(map)
    })

    it('should return same reference when deleting non-existing key', () => {
      const map = new Map<string, number>([['a', 1], ['b', 2]])
      const updated = deleteFromMap('c' as string)(map)
      
      expect(updated).toBe(map) // should return same reference
    })

    it('should delete keys matching function predicate', () => {
      const map = new Map([['a', 1], ['ab', 2], ['abc', 3]])
      const updated = deleteFromMap((key: string) => key.includes('b'))(map)
      
      expect(updated.has('a')).toBe(true)
      expect(updated.has('ab')).toBe(false)
      expect(updated.has('abc')).toBe(false)
      expect(updated.size).toBe(1)
    })
  })

  describe('updateInMap', () => {
    it('should update existing key with function', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = updateInMap('a', (v: number) => v * 2)(map)
      
      expect(updated.get('a')).toBe(2)
      expect(updated.get('b')).toBe(2)
      expect(updated).not.toBe(map)
    })

    it('should update existing key with direct value', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = updateInMap('a', 10)(map)
      
      expect(updated.get('a')).toBe(10)
      expect(updated.get('b')).toBe(2)
    })

    it('should return same reference when key not found', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = updateInMap('c', 10)(map)
      
      expect(updated).toBe(map)
    })

    it('should return same reference when value unchanged', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = updateInMap('a', (v: number) => v)(map)
      
      expect(updated).toBe(map)
    })
  })

  describe('mergeMap', () => {
    it('should merge with another Map', () => {
      const map1 = new Map<string, number>([['a', 1], ['b', 2]])
      const map2 = new Map<string, number>([['c', 3], ['d', 4]])
      const updated = mergeMap(map2)(map1)
      
      expect(updated.size).toBe(4)
      expect(updated.get('a')).toBe(1)
      expect(updated.get('c')).toBe(3)
    })

    it('should merge with Record object', () => {
      const map = new Map<string, number>([['a', 1], ['b', 2]])
      const obj: Record<string, number> = { c: 3, d: 4 }
      const updated = mergeMap(obj)(map)
      
      expect(updated.size).toBe(4)
      expect(updated.get('a')).toBe(1)
      expect(updated.get('c')).toBe(3)
    })

    it('should return same reference when no changes', () => {
      const map = new Map<string, number>([['a', 1], ['b', 2]])
      const obj: Record<string, number> = { a: 1, b: 2 }
      const updated = mergeMap(obj)(map)
      
      expect(updated).toBe(map)
    })
  })

  describe('filterMap', () => {
    it('should filter by predicate', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const updated = filterMap((value: number) => value > 1)(map)
      
      expect(updated.size).toBe(2)
      expect(updated.has('a')).toBe(false)
      expect(updated.has('b')).toBe(true)
      expect(updated.has('c')).toBe(true)
    })

    it('should return same reference when no filtering', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = filterMap(() => true)(map)
      
      expect(updated).toBe(map)
    })
  })

  describe('mapValues', () => {
    it('should transform all values', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = mapValues((value: number) => value * 2)(map)
      
      expect(updated.get('a')).toBe(2)
      expect(updated.get('b')).toBe(4)
      expect(updated).not.toBe(map)
    })

    it('should work with key in transformer', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const updated = mapValues((value: number, key: string) => `${key}:${value}`)(map)
      
      expect(updated.get('a')).toBe('a:1')
      expect(updated.get('b')).toBe('b:2')
    })
  })
}) 