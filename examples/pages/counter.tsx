import React from 'react'
import { ReactStore, op } from 'tiny-store'

// 定义状态类型
interface CounterState {
  count: number
  history: number[]
  name: string
}

// 创建 store 实例
const counterStore = new ReactStore<CounterState>({
  count: 0,
  history: [0],
  name: 'My Counter'
})

// 定义操作函数
const actions = {
  increment: () => {
    counterStore.setState({
      count: (prev) => prev + 1,
      history: op.push(counterStore.getState().count + 1)
    })
  },
  
  decrement: () => {
    counterStore.setState({
      count: (prev) => prev - 1, 
      history: op.push(counterStore.getState().count - 1)
    })
  },
  
  reset: () => {
    counterStore.setState(counterStore.getInitState())
  },
  
  setName: (name: string) => {
    counterStore.setState({ name })
  }
}

// React 组件
export function Counter() {
  // 使用选择器获取特定的状态片段
  const count = counterStore.use(state => state.count)
  const name = counterStore.use(state => state.name)
  const historyLength = counterStore.use(state => state.history.length)
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>{name}</h1>
      <div style={{ fontSize: '2em', margin: '20px 0' }}>
        Count: {count}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={actions.increment} style={{ marginRight: '10px' }}>
          +1
        </button>
        <button onClick={actions.decrement} style={{ marginRight: '10px' }}>
          -1
        </button>
        <button onClick={actions.reset}>
          Reset
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>
          Name: 
          <input 
            value={name}
            onChange={(e) => actions.setName(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      
      <div style={{ fontSize: '0.9em', color: '#666' }}>
        History length: {historyLength}
      </div>
    </div>
  )
}

// 如果想在多个组件中使用，可以导出 store
export { counterStore } 