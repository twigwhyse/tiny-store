import { describe, it, expect } from 'vitest'
import { partial, deepPartial } from '../immutable/object-operators'

describe('Object Operations', () => {
  describe('partial', () => {
    it('should update object properties with direct values', () => {
      const obj = { id: 1, name: 'Alice', age: 25 }
      const updated = partial({ name: 'Bob' as string, age: 30 as number })(obj)
      
      expect(updated).toEqual({ id: 1, name: 'Bob', age: 30 })
      expect(updated).not.toBe(obj)
    })

    it('should update object properties with updater functions', () => {
      const obj = { id: 1, name: 'Alice', count: 5 }
      const updated = partial({
        name: (name: string) => name.toUpperCase(),
        count: (count: number) => count * 2
      })(obj)
      
      expect(updated).toEqual({ id: 1, name: 'ALICE', count: 10 })
    })

    it('should return same reference when no changes needed', () => {
      const obj = { id: 1, name: 'Alice' }
      const updated = partial({ name: 'Alice' as string })(obj)
      
      expect(updated).toBe(obj)
    })

    it('should preserve properties not specified in partial', () => {
      const obj = { id: 1, name: 'Alice', age: 25, city: 'NYC' }
      const updated = partial({ name: 'Bob' as string })(obj)
      
      expect(updated).toEqual({ id: 1, name: 'Bob', age: 25, city: 'NYC' })
    })

    it('should handle mixed value and function updates', () => {
      const obj = { name: 'Alice', count: 5, active: false }
      const updated = partial({
        name: 'Bob' as string,
        count: (count: number) => count + 1,
        active: true as boolean
      })(obj)
      
      expect(updated).toEqual({ name: 'Bob', count: 6, active: true })
    })

    it('should work with empty partial update', () => {
      const obj = { id: 1, name: 'Alice' }
      const updated = partial({})(obj)
      
      expect(updated).toBe(obj)
    })
  })

  describe('deepPartial', () => {
    it('should update nested object properties', () => {
      const obj = {
        id: 1,
        profile: { name: 'Alice', age: 25 },
        settings: { theme: 'dark', lang: 'en' }
      }
      
      const updated = deepPartial<typeof obj>({
        profile: { name: 'Bob' },
        settings: { theme: 'light'}
      })(obj)
      
      expect(updated).toEqual({
        id: 1,
        profile: { name: 'Bob', age: 25 },
        settings: { theme: 'light', lang: 'en' }
      })
      expect(updated).not.toBe(obj)
      expect(updated.profile).not.toBe(obj.profile)
      expect(updated.settings).not.toBe(obj.settings)
    })

    it('should handle array updates in nested objects', () => {
      const obj = {
        id: 1,
        tags: ['tag1', 'tag2'],
        meta: { labels: ['a', 'b'] }
      }
      
      const updated = deepPartial<typeof obj>({
        tags: ['tag1', 'tag2', 'tag3'],
        meta: { labels: ['x', 'y'] }
      })(obj)
      
      expect(updated).toEqual({
        id: 1,
        tags: ['tag1', 'tag2', 'tag3'],
        meta: { labels: ['x', 'y'] }
      })
    })

    it('should work with deeply nested objects', () => {
      const obj = {
        level1: {
          level2: {
            level3: { value: 'original' }
          }
        }
      }
      
      const updated = deepPartial<typeof obj>({
        level1: {
          level2: {
            level3: { value: 'updated' }
          }
        }
      })(obj)
      
      expect(updated.level1.level2.level3.value).toBe('updated')
      expect(updated).not.toBe(obj)
    })

    it('should preserve unchanged nested properties', () => {
      const obj = {
        id: 1,
        profile: { name: 'Alice', age: 25, email: 'alice@test.com' },
        settings: { theme: 'dark', lang: 'en' }
      }
      
      const updated = deepPartial<typeof obj>({
        profile: { name: 'Bob' }
      })(obj)
      
      expect(updated).toEqual({
        id: 1,
        profile: { name: 'Bob', age: 25, email: 'alice@test.com' },
        settings: { theme: 'dark', lang: 'en' }
      })
      expect(updated.settings).toBe(obj.settings) // unchanged nested object should be same reference
    })

    it('should handle mixed updates with functions', () => {
      const obj = {
        id: 1,
        counters: { views: 10, likes: 5 }
      }
      
      const updated = deepPartial<typeof obj>({
        counters: {
          views: (views: number) => views + 1,
          likes: 10
        }
      })(obj)
      
      expect(updated).toEqual({
        id: 1,
        counters: { views: 11, likes: 10 }
      })
    })

    it('should return same reference when no changes needed', () => {
      const obj = {
        profile: { name: 'Alice' }
      }
      
      const updated = deepPartial<typeof obj>({
        profile: { name: 'Alice' }
      })(obj)
      
      expect(updated).toBe(obj)
    })
  })
}) 