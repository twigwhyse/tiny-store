import { describe, it, expect } from 'vitest'
import { idIndex, idIs, pipe, compose } from '../immutable/utility-operators'

describe('Utility Operations', () => {
  describe('idIndex', () => {
    it('should find index of object with matching id', () => {
      const arr = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
        { id: 'c', name: 'Charlie' }
      ]
      
      expect(idIndex('b')(arr)).toBe(1)
      expect(idIndex('a')(arr)).toBe(0)
      expect(idIndex('c')(arr)).toBe(2)
    })

    it('should return -1 when id not found', () => {
      const arr = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' }
      ]
      
      expect(idIndex('x')(arr)).toBe(-1)
    })

    it('should work with empty array', () => {
      const arr: { id: string }[] = []
      
      expect(idIndex('a')(arr)).toBe(-1)
    })
  })

  describe('idIs', () => {
    it('should return true when id matches', () => {
      const obj = { id: 'test', name: 'Test' }
      
      expect(idIs('test')(obj)).toBe(true)
    })

    it('should return false when id does not match', () => {
      const obj = { id: 'test', name: 'Test' }
      
      expect(idIs('other')(obj)).toBe(false)
    })

    it('should work as predicate in array filter', () => {
      const arr = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
        { id: 'a', name: 'Anna' }
      ]
      
      const filtered = arr.filter(idIs('a'))
      expect(filtered).toHaveLength(2)
      expect(filtered[0]?.name).toBe('Alice')
      expect(filtered[1]?.name).toBe('Anna')
    })
  })

  describe('pipe', () => {
    it('should execute functions from left to right', () => {
      const add1 = (n: number) => n + 1
      const multiply2 = (n: number) => n * 2
      const subtract3 = (n: number) => n - 3
      
      const result = pipe(add1, multiply2, subtract3)(5)
      // 5 -> 6 -> 12 -> 9
      expect(result).toBe(9)
    })

    it('should work with single function', () => {
      const add5 = (n: number) => n + 5
      
      expect(pipe(add5)(10)).toBe(15)
    })

    it('should work with no functions', () => {
      const result = pipe()(42)
      
      expect(result).toBe(42)
    })

    it('should work with string operations', () => {
      const addPrefix = (s: string) => `prefix-${s}`
      const addSuffix = (s: string) => `${s}-suffix`
      const toUpper = (s: string) => s.toUpperCase()
      
      const result = pipe(addPrefix, addSuffix, toUpper)('test')
      expect(result).toBe('PREFIX-TEST-SUFFIX')
    })
  })

  describe('compose', () => {
    it('should execute functions from right to left', () => {
      const add1 = (n: number) => n + 1
      const multiply2 = (n: number) => n * 2
      const subtract3 = (n: number) => n - 3
      
      const result = compose(subtract3, multiply2, add1)(5)
      // 5 -> 6 -> 12 -> 9 (same order as pipe but functions listed in reverse)
      expect(result).toBe(9)
    })

    it('should work with single function', () => {
      const add5 = (n: number) => n + 5
      
      expect(compose(add5)(10)).toBe(15)
    })

    it('should work with no functions', () => {
      const result = compose()(42)
      
      expect(result).toBe(42)
    })

    it('should be reverse of pipe with same functions', () => {
      const add1 = (n: number) => n + 1
      const multiply2 = (n: number) => n * 2
      
      const pipeResult = pipe(add1, multiply2)(5)
      const composeResult = compose(multiply2, add1)(5)
      
      expect(pipeResult).toBe(composeResult)
      expect(pipeResult).toBe(12) // 5 -> 6 -> 12
    })
  })
}) 