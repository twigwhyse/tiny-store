import { describe, it, expect } from 'vitest'
import { op } from '../immutable'

describe('Immutable Operations', () => {
  describe('partial', () => {
    it('should update object partially', () => {
      const user = { id: 1, name: 'Alice', age: 30 }
      const updated = op.partial<typeof user>({ name: 'Bob', age: 31 })(user)
      
      expect(updated).toEqual({ id: 1, name: 'Bob', age: 31 })
      expect(updated).not.toBe(user) // should be new object
    })

    it('should work with function updaters', () => {
      const user = { id: 1, name: 'Alice', age: 30 }
      const updated = op.partial<typeof user>({ 
        name: (n: string) => n + ' Smith',
        age: (a: number) => a + 1 
      })(user)
      
      expect(updated).toEqual({ id: 1, name: 'Alice Smith', age: 31 })
    })

    it('should return same reference when no changes are made', () => {
      const user = { id: 1, name: 'Alice', age: 30 }
      const updated = op.partial<typeof user>({ name: 'Alice', age: 30 })(user)
      
      expect(updated).toBe(user) // should return same reference
    })

    it('should return same reference when function updaters return same values', () => {
      const user = { id: 1, name: 'Alice', age: 30 }
      const updated = op.partial<typeof user>({ 
        name: (n: string) => n, // returns same value
        age: (a: number) => a   // returns same value
      })(user)
      
      expect(updated).toBe(user) // should return same reference
    })

    it('should return same reference when updating with empty object', () => {
      const user = { id: 1, name: 'Alice', age: 30 }
      const updated = op.partial<typeof user>({})(user)
      
      expect(updated).toBe(user) // should return same reference
    })
  })

  describe('deepPartial', () => {
    it('should update nested object deeply', () => {
      const user = {
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          bio: 'Hello world'
        }
      }
      
      const updated = op.deepPartial<typeof user>({
        name: 'Bob',
        profile: {
          avatar: 'avatar2.jpg'
        }
      })(user)
      
      expect(updated).toEqual({
        id: 1,
        name: 'Bob',
        profile: {
          avatar: 'avatar2.jpg',
          bio: 'Hello world'
        }
      })
      expect(updated).not.toBe(user)
      expect(updated.profile).not.toBe(user.profile)
    })

    it('should work with function updaters in nested objects', () => {
      const user = {
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          views: 10
        }
      }
      
      const updated = op.deepPartial<typeof user>({
        profile: {
          views: (v: number) => v + 1
        }
      })(user)
      
      expect(updated).toEqual({
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          views: 11
        }
      })
    })

    it('should return same reference when no deep changes are made', () => {
      const user = {
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          bio: 'Hello world'
        }
      }
      
      const updated = op.deepPartial<typeof user>({
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          bio: 'Hello world'
        }
      })(user)
      
      expect(updated).toBe(user) // should return same reference
    })

    it('should return same reference when function updaters return same values in nested objects', () => {
      const user = {
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          views: 10
        }
      }
      
      const updated = op.deepPartial<typeof user>({
        profile: {
          views: (v: number) => v // returns same value
        }
      })(user)
      
      expect(updated).toBe(user) // should return same reference
    })

    it('should return same reference when updating with empty nested object', () => {
      const user = {
        id: 1,
        name: 'Alice',
        profile: {
          avatar: 'avatar1.jpg',
          bio: 'Hello world'
        }
      }
      
      const updated = op.deepPartial<typeof user>({})(user)
      
      expect(updated).toBe(user) // should return same reference
    })
  })

  describe('add/remove operations', () => {
    it('should add to array', () => {
      const arr = ['a', 'b']
      const result = op.add('c')(arr)
      
      expect(result).toEqual(['a', 'b', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should not duplicate when adding existing item to array', () => {
      const arr = ['a', 'b']
      const result = op.add('b')(arr)
      
      expect(result).toEqual(['a', 'b'])
      expect(result).toBe(arr) // should return same reference
    })

    it('should add to Set', () => {
      const set = new Set(['a', 'b'])
      const result = op.add('c')(set)
      
      expect(result).toEqual(new Set(['a', 'b', 'c']))
      expect(result).not.toBe(set)
    })

    it('should not duplicate when adding existing item to Set', () => {
      const set = new Set(['a', 'b'])
      const result = op.add('b')(set)
      
      expect(result).toBe(set) // should return same reference
    })

    it('should remove from array', () => {
      const arr = ['a', 'b', 'c']
      const result = op.remove<string>('b')(arr)
      
      expect(result).toEqual(['a', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should remove from array with function matcher', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = op.remove<number>((x: number) => x > 3)(arr)
      
      expect(result).toEqual([1, 2, 3])
      expect(result).not.toBe(arr)
    })

    it('should remove from Set with function matcher', () => {
      const set = new Set([1, 2, 3, 4, 5])
      const result = op.remove<number>((x: number) => x % 2 === 0)(set)
      
      expect(result).toEqual(new Set([1, 3, 5]))
      expect(result).not.toBe(set)
    })

    it('should return same reference when no removal needed', () => {
      const arr = ['a', 'b', 'c']
      const result = op.remove<string>('d')(arr)
      
      expect(result).toBe(arr)
    })

    it('should work with Sets', () => {
      const set = new Set(['a', 'b'])
      const added = op.add('c')(set)
      const removed = op.remove<string>('b')(added)
      
      expect(added).toEqual(new Set(['a', 'b', 'c']))
      expect(removed).toEqual(new Set(['a', 'c']))
    })
  })

  describe('addToArray and addToSet', () => {
    it('should add to array specifically', () => {
      const arr = ['a', 'b']
      const result = op.addToArray('c')(arr)
      
      expect(result).toEqual(['a', 'b', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should return same reference when adding existing item to array', () => {
      const arr = ['a', 'b']
      const result = op.addToArray('b')(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should add to Set specifically', () => {
      const set = new Set(['a', 'b'])
      const result = op.addToSet('c')(set)
      
      expect(result).toEqual(new Set(['a', 'b', 'c']))
      expect(result).not.toBe(set)
    })

    it('should return same reference when adding existing item to Set', () => {
      const set = new Set(['a', 'b'])
      const result = op.addToSet('b')(set)
      
      expect(result).toBe(set) // should return same reference
    })
  })

  describe('removeFromArray and removeFromSet', () => {
    it('should remove from array specifically', () => {
      const arr = ['a', 'b', 'c']
      const result = op.removeFromArray<string>('b')(arr)
      
      expect(result).toEqual(['a', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should return same reference when removing non-existent item from array', () => {
      const arr = ['a', 'b', 'c']
      const result = op.removeFromArray<string>('d')(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should return same reference when function matcher finds no matches in array', () => {
      const arr = [1, 2, 3]
      const result = op.removeFromArray<number>((x: number) => x > 10)(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should remove from Set specifically', () => {
      const set = new Set(['a', 'b', 'c'])
      const result = op.removeFromSet<string>('b')(set)
      
      expect(result).toEqual(new Set(['a', 'c']))
      expect(result).not.toBe(set)
    })

    it('should return same reference when removing non-existent item from Set', () => {
      const set = new Set(['a', 'b', 'c'])
      const result = op.removeFromSet<string>('d')(set)
      
      expect(result).toBe(set) // should return same reference
    })

    it('should return same reference when function matcher finds no matches in Set', () => {
      const set = new Set([1, 2, 3])
      const result = op.removeFromSet<number>((x: number) => x > 10)(set)
      
      expect(result).toBe(set) // should return same reference
    })
  })

  describe('push', () => {
    it('should push to array', () => {
      const arr = ['a', 'b']
      const result = op.push('c')(arr)
      
      expect(result).toEqual(['a', 'b', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should push duplicate values (unlike add)', () => {
      const arr = ['a', 'b']
      const result = op.push('b')(arr)
      
      expect(result).toEqual(['a', 'b', 'b'])
      expect(result).not.toBe(arr)
    })
  })

  describe('updateAt', () => {
    it('should update at specific index with value', () => {
      const arr = ['a', 'b', 'c']
      const result = op.updateAt<string>(1, 'X')(arr)
      
      expect(result).toEqual(['a', 'X', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should update at specific index with function', () => {
      const arr = [1, 2, 3]
      const result = op.updateAt(1, (x: number) => x * 10)(arr)
      
      expect(result).toEqual([1, 20, 3])
      expect(result).not.toBe(arr)
    })

    it('should return same reference when updating with same value', () => {
      const arr = ['a', 'b', 'c']
      const result = op.updateAt<string>(1, 'b')(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should return same reference when function returns same value', () => {
      const arr = [1, 2, 3]
      const result = op.updateAt(1, (x: number) => x)(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should return same reference when index is out of bounds', () => {
      const arr = ['a', 'b', 'c']
      const result = op.updateAt<string>(10, 'X')(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should return same reference when index finder returns -1', () => {
      const arr = ['a', 'b', 'c']
      const result = op.updateAt<string>((arr: string[]) => arr.indexOf('z'), 'X')(arr)
      
      expect(result).toBe(arr) // should return same reference
    })

    it('should update using index finder function', () => {
      const arr = ['a', 'b', 'c']
      const result = op.updateAt<string>((arr: string[]) => arr.indexOf('b'), 'X')(arr)
      
      expect(result).toEqual(['a', 'X', 'c'])
      expect(result).not.toBe(arr)
    })

    it('should update using index finder with function updater', () => {
      const arr = [1, 2, 3]
      const result = op.updateAt(
        (arr: number[]) => arr.findIndex(x => x === 2), 
        (x: number) => x * 10
      )(arr)
      
      expect(result).toEqual([1, 20, 3])
      expect(result).not.toBe(arr)
    })
  })

  describe('idIndex and idIs', () => {
    const users = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' }
    ]

    it('should find index by id', () => {
      const index = op.idIndex('2')(users)
      expect(index).toBe(1)
    })

    it('should return -1 when id not found', () => {
      const index = op.idIndex('999')(users)
      expect(index).toBe(-1)
    })

    it('should check if object has specific id', () => {
      const user = { id: '2', name: 'Bob' }
      expect(op.idIs('2')(user)).toBe(true)
      expect(op.idIs('1')(user)).toBe(false)
    })

    it('should work together for id-based operations', () => {
      const result = op.updateAt<{ id: string, name: string }>(
        op.idIndex('2'),
        op.partial({ name: 'Robert' as string })
      )(users)
      
      expect(result).toEqual([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Robert' },
        { id: '3', name: 'Charlie' }
      ])
    })
  })

  describe('pipe', () => {
    it('should compose operations in order', () => {
      const arr: string[] = []
      const result = op.pipe(
        op.add('a'),
        op.add('b'), 
        op.push('c')
      )(arr)
      
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('should work with complex operations', () => {
      const user = { id: 1, name: 'Alice', age: 25, active: false }
      const result = op.pipe(
        op.partial<typeof user>({ name: 'Bob' }),
        op.partial<typeof user>({ age: (age: number) => age + 5 }),
        op.partial<typeof user>({ active: true })
      )(user)
      
      expect(result).toEqual({ id: 1, name: 'Bob', age: 30, active: true })
    })
  })

  describe('compose', () => {
    it('should compose operations in reverse order', () => {
      const arr: string[] = []
      const result = op.compose(
        op.push('c'),
        op.add('b'),
        op.add('a')
      )(arr)
      
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('should work with object operations', () => {
      const user = { id: 1, name: 'Alice', age: 25 }
      
      // compose应该从右到左执行，所以先执行age更新，再执行name更新
      const result = op.compose(
        op.partial<typeof user>({ name: (v) => v + ' Bob' }),
        op.partial<typeof user>({ name: (v) => v + ' is' })
      )(user)

      expect(result).toEqual({ id: 1, name: 'Alice is Bob', age: 25 })
    })

    it('should produce different result from pipe with same operations', () => {
      const arr = [1, 2, 3]
      
      const pipeResult = op.pipe(
        op.push(4),
        op.push(5)
      )(arr)
      
      const composeResult = op.compose(
        op.push(5),
        op.push(4)
      )(arr)
      
      expect(pipeResult).toEqual([1, 2, 3, 4, 5])
      expect(composeResult).toEqual([1, 2, 3, 4, 5])
    })
  })
}) 