import React, { useState } from 'react'
import { Counter } from './pages/counter'
import { TodoApp } from './pages/todo-list'
import { PerformanceTest } from './pages/performance-test'
import { MultiInstanceDemo } from './pages/multi-instance'

const examples = [
  {
    id: 'counter',
    title: '计数器示例',
    description: '演示基础的状态管理和更新',
    component: Counter
  },
  {
    id: 'todo',
    title: '待办事项列表',
    description: '演示复杂状态、不可变操作和深度更新',
    component: TodoApp
  },
  {
    id: 'multi-instance',
    title: '多实例 Store',
    description: '演示面向对象设计和多实例 Store 的使用',
    component: MultiInstanceDemo
  },
  {
    id: 'performance',
    title: '性能测试对比',
    description: '对比 TinyStore、Immer 和 Immutable.js 的性能',
    component: PerformanceTest
  }
]

export function ExamplesApp() {
  const [activeExample, setActiveExample] = useState('counter')

  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component || Counter

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* 头部导航 */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e5e9',
        padding: '20px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '28px', 
              color: '#2d3748',
              fontWeight: 'bold'
            }}>
              📦 Tiny Store
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#718096', 
              fontSize: '16px' 
            }}>
              轻量级、类型安全的 React 状态管理库
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <a 
              href="https://github.com/your-username/tiny-store" 
              style={{
                padding: '8px 16px',
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#4a5568',
                fontSize: '14px'
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* 侧边栏 */}
        <nav style={{
          width: '280px',
          background: 'white',
          borderRight: '1px solid #e1e5e9',
          padding: '30px 0'
        }}>
          <div style={{ padding: '0 20px', marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '18px', 
              color: '#2d3748',
              fontWeight: '600'
            }}>
              示例列表
            </h3>
          </div>
          
          {examples.map(example => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                background: activeExample === example.id ? '#edf2f7' : 'transparent',
                borderLeft: activeExample === example.id ? '3px solid #3182ce' : '3px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (activeExample !== example.id) {
                  e.currentTarget.style.background = '#f7fafc'
                }
              }}
              onMouseLeave={(e) => {
                if (activeExample !== example.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ 
                fontWeight: '500', 
                color: '#2d3748',
                marginBottom: '4px'
              }}>
                {example.title}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#718096' 
              }}>
                {example.description}
              </div>
            </button>
          ))}
        </nav>

        {/* 主内容区域 */}
        <main style={{
          flex: 1,
          background: 'white',
          overflow: 'auto'
        }}>
          <div style={{ padding: '30px' }}>
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '24px',
                color: '#2d3748'
              }}>
                {examples.find(ex => ex.id === activeExample)?.title}
              </h2>
              <p style={{ 
                margin: 0, 
                color: '#718096',
                fontSize: '16px'
              }}>
                {examples.find(ex => ex.id === activeExample)?.description}
              </p>
            </div>
            
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <ActiveComponent />
            </div>
          </div>
        </main>
      </div>

      {/* 底部 */}
      <footer style={{
        background: '#2d3748',
        color: 'white',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Built with ❤️ using Tiny Store - 
            <a 
              href="https://github.com/your-username/tiny-store" 
              style={{ color: '#63b3ed', marginLeft: '8px' }}
            >
              查看源码
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
} 