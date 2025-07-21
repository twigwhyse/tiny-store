# Tiny Store

一个轻量级、类型安全的 React 状态管理库，支持不可变数据操作和计算状态。

## ✨ 特性

- 🚀 轻量级：核心代码不到 3KB，零依赖
- 💪 类型安全：完整的 TypeScript 支持  
- ⚡ 高性能：基于 React 18 的 `useSyncExternalStore`
- 🔄 不可变操作：内置丰富的不可变数据操作工具
- 🧮 计算状态：支持自动计算和缓存派生状态
- 📦 零依赖：仅依赖 React，无需 Immer 或其他库

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

```tsx
import { ReactStore } from 'tiny-store'

// 定义状态类型（使用 type）
type CounterState = {
  count: number
  name: string
}

// 创建 store
const counterStore = new ReactStore<CounterState>({
  count: 0,
  name: 'My Counter'
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

### 不可变数组操作

```tsx
import { ReactStore, op } from 'tiny-store'

type TodoState = {
  todos: Array<{ id: string; text: string; completed: boolean }>
  selectedTags: string[]
}

const todoStore = new ReactStore<TodoState>({
  todos: [],
  selectedTags: []
})

// 添加项目
todoStore.setState({
  todos: op.push({ id: '1', text: '学习 TinyStore', completed: false })
})

// 更新特定项目
todoStore.setState({
  todos: op.updateAt(
    op.idIndex('1'), // 通过 ID 查找索引
    op.partial({ completed: true }) // 部分更新
  )
})

// 删除项目
todoStore.setState({
  selectedTags: op.remove('urgent')
})

// 添加标签（如果不存在）
todoStore.setState({
  selectedTags: op.add('important')
})
```

### 计算状态

```tsx
import { ReactStore } from 'tiny-store'

type AppState = {
  todos: Array<{ completed: boolean }>
  stats: {
    total: number
    completed: number
  }
}

class TodoStore extends ReactStore<AppState> {
  constructor() {
    super({
      todos: [],
      stats: { total: 0, completed: 0 }
    })
  }
  
  // 自动计算派生状态
  protected computedState(state: AppState): AppState {
    state.stats = {
      total: state.todos.length,
      completed: state.todos.filter(t => t.completed).length
    }
    return state
  }
}

const todoStore = new TodoStore()
```

### 多实例 Store 使用

```tsx
import React, { createContext, useContext, useState } from 'react'
import { ReactStore, op } from 'tiny-store'

type ProjectState = {
  project: Project
  tasks: Task[]
  members: string[]
}

type Project = {
  id: string
  name: string
}

type Task = {
  id: string
  title: string
  assignee: string
  completed: boolean
}

// 辅助函数
const generateId = () => Math.random().toString(36).substr(2, 9)

// 定义业务 Store
class ProjectStore extends ReactStore<ProjectState> {
  constructor(project: Project) {
    super({
      project,
      tasks: [],
      members: []
    })
  }
  
  // 业务方法
  addTask = (title: string, assignee: string) => {
    const newTask = { id: generateId(), title, assignee, completed: false }
    this.setState({ tasks: op.push(newTask) })
    this.addMember(assignee)
  }
  
  addMember = (member: string) => {
    this.setState({ members: op.add(member) })
  }
}

// Context 和 Provider
const ProjectContext = createContext<ProjectStore | null>(null)

function ProjectProvider({ project, children }: { 
  project: Project, 
  children: React.ReactNode 
}) {
  const [store] = useState(() => new ProjectStore(project))
  
  return (
    <ProjectContext.Provider value={store}>
      {children}
    </ProjectContext.Provider>
  )
}

// Hook 使用
function useProjectStore() {
  const store = useContext(ProjectContext)
  if (!store) throw new Error('Must be used within ProjectProvider')
  return store
}

// 组件中使用
function TaskList() {
  const store = useProjectStore()
  const tasks = store.use(state => state.tasks)
  
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}

// 多个项目实例
function App() {
  const projects = [
    { id: '1', name: '项目A' },
    { id: '2', name: '项目B' }
  ]
  
  return (
    <div>
      {projects.map(project => (
        <ProjectProvider key={project.id} project={project}>
          <ProjectPanel />
        </ProjectProvider>
      ))}
    </div>
  )
}
```

### 复杂不可变操作

```tsx
import { ReactStore, op } from 'tiny-store'

type User = {
  id: string
  profile: {
    name: string
    settings: {
      theme: string
      notifications: boolean
    }
  }
  tags: string[]
}

const userStore = new ReactStore<{ user: User }>({
  user: {
    id: '1',
    profile: {
      name: 'Alice',
      settings: { theme: 'light', notifications: true }
    },
    tags: ['developer']
  }
})

// 深度部分更新
userStore.setState({
  user: op.deepPartial<User>({
    profile: {
      name: 'Bob',
      settings: {
        theme: 'dark'
      }
    },
    tags: op.pipe(
      op.add('designer'),
      op.remove('developer')
    )
  })
})
```

## 📚 API 文档

### ReactStore

```tsx
class ReactStore<T> extends Store<T> {
  constructor(initialState: T)
  use<D>(selector: (state: T) => D): D // React hook
  setState(updates: Partial<T>): void
  getState(): T
  getInitState(): T
  subscribe(listener: (state: T) => void): () => void
}
```

### Store (基础类)

```tsx
class Store<T> {
  constructor(initialState: T)
  setState(updates: Partial<T>): void
  getState(): T
  getInitState(): T
  subscribe(listener: (state: T) => void): () => void
  protected computedState(state: T): T // 重写以添加计算状态
}
```

### 不可变操作工具 (op)

#### 对象操作
- `op.partial<T>(updates)` - 部分更新对象，支持函数更新器
- `op.deepPartial<T>(updates)` - 深度部分更新对象

#### 数组操作
- `op.push<T>(value)` - 推入数组末尾
- `op.add<T>(value)` - 添加到数组（不重复）或 Set
- `op.remove<T>(matcher)` - 从数组或 Set 中删除
- `op.updateAt<T>(index, updater)` - 更新指定索引的元素

#### 实用工具
- `op.idIndex(id)` - 通过 ID 查找数组索引
- `op.idIs(id)` - 创建 ID 匹配器
- `op.pipe(...fns)` - 函数管道组合（从左到右）
- `op.compose(...fns)` - 函数组合（从右到左）

### 类型定义

```tsx
type ValueUpdater<T> = T | ((value: T) => T)
type ValueMatcher<T> = T | ((value: T) => boolean)
type IndexFinder<T> = number | ((arr: T[]) => number)
type DeepPartial<T> = { ... } // 深度部分类型
```

## 🎯 设计理念

TinyStore 采用**面向对象设计**，让 Store 成为包含业务逻辑的**充血模型**，而不是贫血的数据容器：

### 🏗️ 充血模型的优势

1. **业务逻辑内聚**：将数据和操作封装在 Store 类中，避免逻辑分散
2. **分层设计友好**：支持复杂应用的分层架构，Store 直接承担数据层职责
3. **代码组织清晰**：业务方法、计算状态、数据验证都在 Store 内部
4. **易于测试**：可以直接测试 Store 的业务方法，无需 React 环境

### 🔄 多实例支持

- **单实例模式**：全局状态管理，跨组件共享
- **多实例模式**：通过 Context 提供临时 Store，适用于：
  - 模态框、弹窗的临时状态
  - 列表项的独立状态管理
  - 多 Tab 页面的隔离状态
  - 动态创建的组件实例

### 💡 充血模型示例

```tsx
// 状态类型定义（使用 type）
type UserState = {
  profile: ProfileData
  preferences: UserPreferences
  isComplete: boolean
}

type LoginData = {
  username: string
  password: string
}

type ProfileData = {
  name: string
  email: string
  avatar: string
}

type UserPreferences = {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

// 充血模型示例
class UserStore extends ReactStore<UserState> {
  // 业务方法
  login = (credentials: LoginData) => { /*...*/ }
  updateProfile = (data: ProfileData) => { /*...*/ }
  
  // 计算状态
  protected computedState(state: UserState) {
    state.isComplete = this.validateProfile(state.profile)
    return state
  }
  
  // 业务查询
  getPreferences = () => this.getState().preferences
  
  // 私有业务逻辑
  private validateProfile = (profile: ProfileData): boolean => {
    return profile.name.length > 0 && profile.email.includes('@')
  }
}
```

## 🎯 完整示例

查看 [examples](./examples) 目录获取更多完整示例：

- [计数器示例](./examples/pages/counter.tsx) - 基础状态管理
- [待办事项列表](./examples/pages/todo-list.tsx) - 复杂状态和不可变操作
- [多实例 Store](./examples/pages/multi-instance.tsx) - 面向对象设计和多实例使用
- [性能测试](./examples/pages/performance-test.tsx) - 与其他库的性能对比

运行示例：
```bash
pnpm run examples
```

## 🎨 类型定义最佳实践

### ⚠️ 重要：使用 `type` 而不是 `interface`

在定义状态类型时，**强烈建议使用 `type` 而不是 `interface`**，原因如下：

#### 🔍 TypeScript 类型系统差异

```tsx
// ❌ 不推荐：使用 interface
interface UserState {
  name: string
  age: number
}

// ✅ 推荐：使用 type  
type UserState = {
  name: string
  age: number
}
```

#### 🎯 为什么推荐使用 `type`？

1. **避免声明合并问题**：`interface` 支持声明合并，可能导致意外的类型扩展
2. **更严格的类型检查**：`type` 不会要求 string index 签名 `[x: string]: any`
3. **更好的封装性**：防止第三方库意外扩展你的状态类型
4. **避免复杂的类型推断**：`type` 的行为更加可预测

#### 🚨 Interface 可能遇到的问题

```tsx
// interface 可能需要额外的 string index 签名
interface BadState {
  count: number
  // 可能需要这行来满足某些 TypeScript 检查
  // [x: string]: any
}

// type 不会有这个问题
type GoodState = {
  count: number
  // 无需额外的 string index 签名
}
```

### 📂 推荐的项目结构

```
src/
├── stores/
│   ├── types.ts          # 集中的类型定义
│   ├── userStore.ts      # 用户相关 Store
│   └── todoStore.ts      # 待办事项 Store
└── components/
    ├── User/
    └── Todo/
```

### 📝 类型文件示例 (types.ts)

```tsx
// 基础实体类型
export type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

export type Todo = {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: Date
}

// 状态类型
export type UserState = {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
}

export type TodoState = {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  loading: boolean
}

// 操作参数类型
export type LoginCredentials = {
  email: string
  password: string
}

export type CreateTodoParams = {
  title: string
  userId: string
}
```

### 🔧 Store 实现示例

```tsx
// userStore.ts
import { ReactStore } from 'tiny-store'
import type { UserState, LoginCredentials, User } from './types'

export class UserStore extends ReactStore<UserState> {
  constructor() {
    super({
      currentUser: null,
      users: [],
      loading: false,
      error: null
    })
  }
  
  login = async (credentials: LoginCredentials) => {
    this.setState({ loading: true, error: null })
    try {
      const user = await authService.login(credentials)
      this.setState({ 
        currentUser: user,
        loading: false 
      })
    } catch (error) {
      this.setState({ 
        error: error.message,
        loading: false 
      })
    }
  }
}
```

### ⚡ 性能优化建议

1. **避免过深的嵌套**：扁平化状态结构有利于性能
2. **合理拆分 Store**：按业务域拆分，避免单个 Store 过大
3. **使用具体的 selector**：避免返回整个状态对象

```tsx
// ✅ 好的 selector
const userName = store.use(state => state.user.name)

// ❌ 避免返回整个对象（除非确实需要）
const user = store.use(state => state.user)
```

## 🚀 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build

# 运行示例
pnpm examples
```

## 📄 License

ISC
