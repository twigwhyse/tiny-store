import React, { useState, useCallback, useMemo } from 'react'
import { ReactStore, op } from '../../src/index'
import { produce } from 'immer'
import { Map, List, fromJS } from 'immutable'

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
    setIsRunning(false)
  }, [testData, immutableData, testSize])

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
          包括深度更新、添加元素、批量更新和嵌套更新等场景。
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