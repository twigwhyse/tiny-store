# Tiny Store

一个轻量级、类型安全的 React 状态管理库，支持不可变数据操作。

## ✨ 特性

- 🚀 轻量级：核心代码不到 2KB
- 💪 类型安全：完整的 TypeScript 支持
- ⚡ 高性能：基于 React 18 的 `useSyncExternalStore`
- 🔄 不可变操作：内置丰富的不可变数据操作工具
- 📦 零依赖：仅依赖 React 和 Immer

## 📦 安装

```bash
npm install tiny-store
# 或
pnpm add tiny-store
# 或
yarn add tiny-store
```

## 🚀 快速开始

### 基础用法

```typescript
import { ReactStore } from 'tiny-store'

// 创建 store
const counterStore = new ReactStore({
  count: 0,
  name: 'Counter'
})

// 在 React 组件中使用
function Counter() {
  const count = counterStore.use(state => state.count)
  const name = counterStore.use(state => state.name)
  
  const increment = () => {
    counterStore.setState({ count: c => c + 1 })
  }
  
  return (
    <div>
      <h1>{name}: {count}</h1>
      <button onClick={increment}>+1</button>
    </div>
  )
}
```

### 不可变操作

```typescript
import { ReactStore, op } from 'tiny-store'

interface User {
  id: string
  name: string
  tags: string[]
}

const userStore = new ReactStore<{ user: User }>({
  user: {
    id: '1',
    name: 'Alice',
    tags: ['developer']
  }
})

// 部分更新
userStore.setState({
  user: op.partial<User>({
    name: 'Bob',
    tags: op.add('designer')
  })
})

// 深度更新
userStore.setState({
  user: op.deepPartial<User>({
    name: n => n + ' Smith',
    tags: op.pipe(
      op.add('manager'),
      op.remove('developer')
    )
  })
})
```

## 📚 API 文档

### ReactStore

```typescript
class ReactStore<T> extends Store<T> {
  use<D>(selector: (state: T) => D): D
}
```

### 不可变操作工具

- `op.partial(updates)` - 部分更新对象
- `op.deepPartial(updates)` - 深度部分更新对象
- `op.add(value)` - 添加到数组或 Set
- `op.remove(value)` - 从数组或 Set 中删除
- `op.push(value)` - 推入数组
- `op.pipe(...fns)` - 函数管道组合
- `op.compose(...fns)` - 函数组合

## 🎯 示例

## 📄 License

ISC
