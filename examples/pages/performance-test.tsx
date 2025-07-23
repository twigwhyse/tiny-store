import React, { useState, useCallback, useMemo } from 'react'
import { op } from '../../src/index'
import { produce, enableMapSet } from 'immer'
import { fromJS, Map as IMap } from 'immutable'

// 启用 Immer 对 Map 和 Set 的支持
enableMapSet()

// 测试数据类型
interface TestUser {
  id: string
  name: string
  email: string
  age: number
  tags: string[]
  profile: {
    avatar: string
    bio: string
    settings: {
      theme: string
      notifications: boolean
    }
  }
  [key: string]: any
}

interface TestState {
  users: TestUser[]
  settings: {
    theme: string
    language: string
  }
  stats: {
    userCount: number
    activeUsers: number
  }
  [key: string]: any
}

// Map 测试数据类型
interface MapTestData {
  userMap: Map<string, TestUser>
  settingsMap: Map<string, string>
  statsMap: Map<string, number>
  nestedMap: Map<string, Map<string, any>>
}

// 生成测试数据
function generateTestData(count: number): TestState {
  const users: TestUser[] = []
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      age: 20 + (i % 40),
      tags: [`tag-${i % 5}`, `category-${i % 3}`],
      profile: {
        avatar: `avatar-${i}.jpg`,
        bio: `Bio for user ${i}`,
        settings: {
          theme: i % 2 === 0 ? 'light' : 'dark',
          notifications: i % 3 === 0
        }
      }
    })
  }
  
  return {
    users,
    settings: {
      theme: 'light',
      language: 'zh-CN'
    },
    stats: {
      userCount: count,
      activeUsers: Math.floor(count * 0.7)
    }
  }
}

// 生成 Map 测试数据
function generateMapTestData(count: number): MapTestData {
  const userMap = new Map<string, TestUser>()
  const settingsMap = new Map<string, string>()
  const statsMap = new Map<string, number>()
  const nestedMap = new Map<string, Map<string, any>>()

  // 生成用户 Map
  for (let i = 0; i < count; i++) {
    const user: TestUser = {
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      age: 20 + (i % 40),
      tags: [`tag-${i % 5}`, `category-${i % 3}`],
      profile: {
        avatar: `avatar-${i}.jpg`,
        bio: `Bio for user ${i}`,
        settings: {
          theme: i % 2 === 0 ? 'light' : 'dark',
          notifications: i % 3 === 0
        }
      }
    }
    userMap.set(user.id, user)
  }

  // 生成设置 Map
  settingsMap.set('theme', 'light')
  settingsMap.set('language', 'zh-CN')
  settingsMap.set('timezone', 'Asia/Shanghai')
  settingsMap.set('fontSize', 'medium')
  settingsMap.set('layout', 'grid')

  // 生成统计 Map
  statsMap.set('userCount', count)
  statsMap.set('activeUsers', Math.floor(count * 0.7))
  statsMap.set('totalPosts', count * 5)
  statsMap.set('totalComments', count * 12)
  statsMap.set('totalLikes', count * 25)

  // 生成嵌套 Map
  for (let i = 0; i < Math.min(10, count); i++) {
    const innerMap = new Map<string, any>()
    innerMap.set('name', `Category ${i}`)
    innerMap.set('count', i * 10)
    innerMap.set('active', i % 2 === 0)
    nestedMap.set(`category-${i}`, innerMap)
  }

  return {
    userMap,
    settingsMap,
    statsMap,
    nestedMap
  }
}

// 性能测试结果类型
interface BenchmarkResult {
  name: string
  operations: number
  totalTime: number
  avgTime: number
  opsPerSecond: number
}

// 性能测试函数
function benchmark(name: string, fn: () => void, iterations: number = 1000): BenchmarkResult {
  const start = performance.now()
  
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  
  const end = performance.now()
  const totalTime = end - start
  const avgTime = totalTime / iterations
  const opsPerSecond = 1000 / avgTime
  
  return {
    name,
    operations: iterations,
    totalTime,
    avgTime,
    opsPerSecond
  }
}

export function PerformanceTest() {
  const [testSize, setTestSize] = useState(100)
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // 测试数据
  const testData = useMemo(() => generateTestData(testSize), [testSize])
  const immutableData = useMemo(() => fromJS(testData), [testData])
  
  // Map 测试数据
  const mapTestData = useMemo(() => generateMapTestData(testSize), [testSize])
  const immutableMapData = useMemo(() => fromJS({
    userMap: Array.from(mapTestData.userMap.entries()),
    settingsMap: Array.from(mapTestData.settingsMap.entries()),
    statsMap: Array.from(mapTestData.statsMap.entries()),
    nestedMap: Array.from(mapTestData.nestedMap.entries()).map(([key, value]) => [key, Array.from(value.entries())])
  }), [mapTestData])

  // 运行性能测试
  const runTests = useCallback(async () => {
    setIsRunning(true)
    setResults([])
    
    const newResults: BenchmarkResult[] = []
    const iterations = Math.max(100, Math.min(1000, 10000 / testSize))

    // 测试 1: 深度更新用户名
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // TinyStore 操作符
    const tinyStoreTest1 = benchmark('TinyStore - 深度更新用户名', () => {
      op.partial<TestState>({
        users: op.updateAt(
          0,
          op.partial<TestUser>({ name: 'Updated Name' })
        )
      })(testData)
    }, iterations)
    newResults.push(tinyStoreTest1)

    // Immer
    const immerTest1 = benchmark('Immer - 深度更新用户名', () => {
      produce(testData, draft => {
        if (draft.users[0]) {
          draft.users[0].name = 'Updated Name'
        }
      })
    }, iterations)
    newResults.push(immerTest1)

    // Immutable.js
    const immutableTest1 = benchmark('Immutable.js - 深度更新用户名', () => {
      immutableData.setIn(['users', 0, 'name'], 'Updated Name')
    }, iterations)
    newResults.push(immutableTest1)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 2: 添加新用户
    const newUser: TestUser = {
      id: 'new-user',
      name: 'New User',
      email: 'new@example.com',
      age: 25,
      tags: ['new'],
      profile: {
        avatar: 'new-avatar.jpg',
        bio: 'New user bio',
        settings: {
          theme: 'light',
          notifications: true
        }
      }
    }

    // TinyStore 操作符
    const tinyStoreTest2 = benchmark('TinyStore - 添加新用户', () => {
      op.partial<TestState>({
        users: op.push(newUser),
        stats: op.partial({
          userCount: (count: number) => count + 1
        })
      })(testData)
    }, iterations)
    newResults.push(tinyStoreTest2)

    // Immer
    const immerTest2 = benchmark('Immer - 添加新用户', () => {
      produce(testData, draft => {
        draft.users.push(newUser)
        draft.stats.userCount += 1
      })
    }, iterations)
    newResults.push(immerTest2)

    // Immutable.js
    const immutableTest2 = benchmark('Immutable.js - 添加新用户', () => {
      immutableData
        .updateIn(['users'], (users: any) => users.push(fromJS(newUser)))
        .updateIn(['stats', 'userCount'], (count: any) => count + 1)
    }, iterations)
    newResults.push(immutableTest2)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 3: 批量更新用户标签
    const tinyStoreTest3 = benchmark('TinyStore - 批量更新标签', () => {
      op.partial<TestState>({
        users: op.pipe(
          ...testData.users.slice(0, Math.min(10, testData.users.length)).map((_, index) =>
            op.updateAt<TestUser>(
              index,
              op.partial({ tags: op.add('batch-updated') })
            )
          )
        )
      })(testData)
    }, Math.max(50, iterations / 5))
    newResults.push(tinyStoreTest3)

    // Immer - 批量更新
    const immerTest3 = benchmark('Immer - 批量更新标签', () => {
      produce(testData, draft => {
        for (let i = 0; i < Math.min(10, draft.users.length); i++) {
          if (!draft.users[i].tags.includes('batch-updated')) {
            draft.users[i].tags.push('batch-updated')
          }
        }
      })
    }, Math.max(50, iterations / 5))
    newResults.push(immerTest3)

    // Immutable.js - 批量更新
    const immutableTest3 = benchmark('Immutable.js - 批量更新标签', () => {
      let result = immutableData
      for (let i = 0; i < Math.min(10, testData.users.length); i++) {
        result = result.updateIn(['users', i, 'tags'], (tags: any) => 
          tags.includes('batch-updated') ? tags : tags.push('batch-updated')
        )
      }
      return result
    }, Math.max(50, iterations / 5))
    newResults.push(immutableTest3)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 4: 深度嵌套更新
    const tinyStoreTest4 = benchmark('TinyStore - 深度嵌套更新', () => {
      op.partial<TestState>({
        users: op.updateAt(
          0,
          op.deepPartial<TestUser>({
            profile: {
              settings: {
                theme: 'dark',
                notifications: false
              }
            }
          })
        )
      })(testData)
    }, iterations)
    newResults.push(tinyStoreTest4)

    // Immer - 深度嵌套更新
    const immerTest4 = benchmark('Immer - 深度嵌套更新', () => {
      produce(testData, draft => {
        if (draft.users[0]) {
          draft.users[0].profile.settings.theme = 'dark'
          draft.users[0].profile.settings.notifications = false
        }
      })
    }, iterations)
    newResults.push(immerTest4)

    // Immutable.js - 深度嵌套更新
    const immutableTest4 = benchmark('Immutable.js - 深度嵌套更新', () => {
      immutableData
        .setIn(['users', 0, 'profile', 'settings', 'theme'], 'dark')
        .setIn(['users', 0, 'profile', 'settings', 'notifications'], false)
    }, iterations)
    newResults.push(immutableTest4)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // ==================== Map 类型测试 ====================
    
    // 测试 5: Map 设置键值对
    const tinyStoreMapTest1 = benchmark('TinyStore - Map设置键值对', () => {
      op.setInMap<string, TestUser>('newUser', {
        id: 'new-user',
        name: 'New User',
        email: 'new@example.com',
        age: 25,
        tags: ['new'],
        profile: {
          avatar: 'new.jpg',
          bio: 'New user',
          settings: { theme: 'light', notifications: true }
        }
      })(mapTestData.userMap)
    }, iterations)
    newResults.push(tinyStoreMapTest1)

    // Immer - Map设置键值对
    const immerMapTest1 = benchmark('Immer - Map设置键值对', () => {
      produce(mapTestData, draft => {
        draft.userMap.set('newUser', {
          id: 'new-user',
          name: 'New User',
          email: 'new@example.com',
          age: 25,
          tags: ['new'],
          profile: {
            avatar: 'new.jpg',
            bio: 'New user',
            settings: { theme: 'light', notifications: true }
          }
        })
      })
    }, iterations)
    newResults.push(immerMapTest1)

    // Immutable.js - Map设置键值对  
    const immutableMapTest1 = benchmark('Immutable.js - Map设置键值对', () => {
      // 由于 Map 转换为数组存储，这里模拟添加新的键值对
      const userMapArray = immutableMapData.get('userMap') as any
      const newEntry = ['newUser', fromJS({
        id: 'new-user',
        name: 'New User',
        email: 'new@example.com',
        age: 25,
        tags: ['new'],
        profile: {
          avatar: 'new.jpg',
          bio: 'New user',
          settings: { theme: 'light', notifications: true }
        }
      })]
      return immutableMapData.set('userMap', userMapArray.push(newEntry))
    }, iterations)
    newResults.push(immutableMapTest1)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 6: Map 更新值
    const firstUserId = mapTestData.userMap.keys().next().value
    if (firstUserId) {
      const tinyStoreMapTest2 = benchmark('TinyStore - Map更新值', () => {
        op.updateInMap(firstUserId, (user: TestUser) => ({
          ...user,
          name: 'Updated User',
          age: user.age + 1
        }))(mapTestData.userMap)
      }, iterations)
      newResults.push(tinyStoreMapTest2)

      // Immer - Map更新值
      const immerMapTest2 = benchmark('Immer - Map更新值', () => {
        produce(mapTestData, draft => {
          const user = draft.userMap.get(firstUserId)
          if (user) {
            user.name = 'Updated User'
            user.age = user.age + 1
          }
        })
      }, iterations)
      newResults.push(immerMapTest2)

      // Immutable.js - Map更新值
      const immutableMapTest2 = benchmark('Immutable.js - Map更新值', () => {
        // 在数组结构中找到并更新用户
        return immutableMapData.updateIn(['userMap'], (userMapArray: any) => {
          const index = userMapArray.findIndex((entry: any) => entry.get(0) === firstUserId)
          if (index >= 0) {
            return userMapArray.updateIn([index, 1], (user: any) => 
              user.set('name', 'Updated User').update('age', (age: number) => age + 1)
            )
          }
          return userMapArray
        })
      }, iterations)
      newResults.push(immutableMapTest2)
    }

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 7: Map 批量操作
    const tinyStoreMapTest3 = benchmark('TinyStore - Map批量更新', () => {
      let result = mapTestData.settingsMap
      const updates = [
        ['theme', 'dark'],
        ['language', 'en-US'],
        ['fontSize', 'large']
      ] as [string, string][]
      
      for (const [key, value] of updates) {
        result = op.setInMap(key, value)(result)
      }
      return result
    }, Math.max(50, iterations / 3))
    newResults.push(tinyStoreMapTest3)

    // Immer - Map批量更新
    const immerMapTest3 = benchmark('Immer - Map批量更新', () => {
      produce(mapTestData, draft => {
        draft.settingsMap.set('theme', 'dark')
        draft.settingsMap.set('language', 'en-US')
        draft.settingsMap.set('fontSize', 'large')
      })
    }, Math.max(50, iterations / 3))
    newResults.push(immerMapTest3)

    // Immutable.js - Map批量更新
    const immutableMapTest3 = benchmark('Immutable.js - Map批量更新', () => {
      // 批量更新数组格式的设置数据
      return immutableMapData.updateIn(['settingsMap'], (settingsArray: any) => {
        let result = settingsArray
        const updates = [['theme', 'dark'], ['language', 'en-US'], ['fontSize', 'large']]
        updates.forEach(([key, value]) => {
          const index = result.findIndex((entry: any) => entry.get(0) === key)
          if (index >= 0) {
            result = result.setIn([index, 1], value)
          }
        })
        return result
      })
    }, Math.max(50, iterations / 3))
    newResults.push(immutableMapTest3)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 8: Map 删除键
    const tinyStoreMapTest4 = benchmark('TinyStore - Map删除键', () => {
      return op.deleteFromMap('timezone')(mapTestData.settingsMap as any)
    }, iterations)
    newResults.push(tinyStoreMapTest4)

    // Immer - Map删除键
    const immerMapTest4 = benchmark('Immer - Map删除键', () => {
      produce(mapTestData, draft => {
        draft.settingsMap.delete('timezone')
      })
    }, iterations)
    newResults.push(immerMapTest4)

    // Immutable.js - Map删除键
    const immutableMapTest4 = benchmark('Immutable.js - Map删除键', () => {
      // 从数组中删除指定的键值对
      return immutableMapData.updateIn(['settingsMap'], (settingsArray: any) => {
        const index = settingsArray.findIndex((entry: any) => entry.get(0) === 'timezone')
        return index >= 0 ? settingsArray.delete(index) : settingsArray
      })
    }, iterations)
    newResults.push(immutableMapTest4)

    setResults([...newResults])
    await new Promise(resolve => setTimeout(resolve, 100))

    // 测试 9: 嵌套 Map 更新
    const firstCategoryKey = mapTestData.nestedMap.keys().next().value
    if (firstCategoryKey) {
      const tinyStoreMapTest5 = benchmark('TinyStore - 嵌套Map更新', () => {
        op.updateInMap(firstCategoryKey, op.setInMap('count', 999))(mapTestData.nestedMap)
      }, iterations)
      newResults.push(tinyStoreMapTest5)

      // Immer - 嵌套Map更新
      const immerMapTest5 = benchmark('Immer - 嵌套Map更新', () => {
        produce(mapTestData, draft => {
          const innerMap = draft.nestedMap.get(firstCategoryKey)
          if (innerMap) {
            innerMap.set('count', 999)
          }
        })
      }, iterations)
      newResults.push(immerMapTest5)

      // Immutable.js - 嵌套Map更新
      const immutableMapTest5 = benchmark('Immutable.js - 嵌套Map更新', () => {
        // 在嵌套数组结构中更新内层 Map
        return immutableMapData.updateIn(['nestedMap'], (nestedArray: any) => {
          const outerIndex = nestedArray.findIndex((entry: any) => entry.get(0) === firstCategoryKey)
          if (outerIndex >= 0) {
            return nestedArray.updateIn([outerIndex, 1], (innerArray: any) => {
              const innerIndex = innerArray.findIndex((entry: any) => entry.get(0) === 'count')
              return innerIndex >= 0 ? innerArray.setIn([innerIndex, 1], 999) : innerArray
            })
          }
          return nestedArray
        })
      }, iterations)
      newResults.push(immutableMapTest5)
    }

    setResults([...newResults])
    setIsRunning(false)
  }, [testData, immutableData, mapTestData, immutableMapData, testSize])

  // 按测试类型分组结果
  const groupedResults = useMemo(() => {
    const groups: Record<string, BenchmarkResult[]> = {}
    results.forEach(result => {
      const testType = result.name.split(' - ')[1] || 'Unknown'
      if (!groups[testType]) {
        groups[testType] = []
      }
      groups[testType].push(result)
    })
    return groups
  }, [results])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#2d3748' }}>
        性能测试对比：TinyStore vs Immer vs Immutable.js
      </h1>
      
      <div style={{ 
        background: '#f7fafc', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px' 
      }}>
        <h2 style={{ marginTop: 0, color: '#4a5568' }}>测试说明</h2>
        <p style={{ margin: '10px 0', color: '#718096' }}>
          本测试对比了 TinyStore 操作符、Immer 和 Immutable.js 在常见不可变操作中的性能表现。
          包括对象的深度更新、添加元素、批量更新和嵌套更新等场景，以及 Map 类型数据的设置键值对、更新值、批量操作、删除键和嵌套 Map 更新等操作。
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4a5568' }}>数据规模：</span>
            <select 
              value={testSize} 
              onChange={(e) => setTestSize(Number(e.target.value))}
              style={{ 
                padding: '4px 8px', 
                borderRadius: '4px', 
                border: '1px solid #cbd5e0' 
              }}
            >
              <option value={10}>10 条记录</option>
              <option value={100}>100 条记录</option>
              <option value={1000}>1000 条记录</option>
              <option value={5000}>5000 条记录</option>
            </select>
          </label>
          
          <button
            onClick={runTests}
            disabled={isRunning}
            style={{
              padding: '8px 16px',
              background: isRunning ? '#a0aec0' : '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? '测试中...' : '开始测试'}
          </button>
        </div>
      </div>

      {Object.keys(groupedResults).length > 0 && (
        <div>
          <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>测试结果</h2>
          
          {Object.entries(groupedResults).map(([testType, testResults]) => (
            <div key={testType} style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#4a5568',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px'
              }}>
                {testType}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '15px' 
              }}>
                {testResults.map((result, index) => {
                  const library = result.name.split(' - ')[0]
                  const isWinner = testResults.every(r => result.opsPerSecond >= r.opsPerSecond)
                  
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        border: isWinner ? '2px solid #48bb78' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <h4 style={{ 
                        margin: '0 0 10px 0', 
                        color: isWinner ? '#38a169' : '#4a5568',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {library}
                        {isWinner && <span style={{ fontSize: '12px' }}>🏆</span>}
                      </h4>
                      
                      <div style={{ fontSize: '14px', color: '#718096' }}>
                        <div>操作次数: {result.operations.toLocaleString()}</div>
                        <div>总耗时: {result.totalTime.toFixed(2)}ms</div>
                        <div>平均耗时: {result.avgTime.toFixed(4)}ms</div>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: '#2d3748',
                          marginTop: '5px' 
                        }}>
                          性能: {Math.round(result.opsPerSecond).toLocaleString()} ops/sec
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* 性能对比条形图 */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
                  性能对比 (ops/sec):
                </div>
                {testResults.map((result, index) => {
                  const maxOps = Math.max(...testResults.map(r => r.opsPerSecond))
                  const percentage = (result.opsPerSecond / maxOps) * 100
                  const library = result.name.split(' - ')[0]
                  
                  return (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '12px',
                        marginBottom: '2px'
                      }}>
                        <span style={{ color: '#4a5568' }}>{library}</span>
                        <span style={{ color: '#718096' }}>
                          {Math.round(result.opsPerSecond).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ 
                        background: '#e2e8f0', 
                        height: '8px', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          background: library === 'TinyStore' ? '#4299e1' : 
                                    library === 'Immer' ? '#ed8936' : '#805ad5',
                          height: '100%', 
                          width: `${percentage}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {results.length === 0 && !isRunning && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#718096',
          background: '#f7fafc',
          borderRadius: '8px'
        }}>
          点击"开始测试"按钮运行性能测试
        </div>
      )}
    </div>
  )
} 