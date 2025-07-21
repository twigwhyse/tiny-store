import React, { createContext, useContext, useState } from 'react'
import { ReactStore, op } from 'tiny-store'

// 数据模型定义
type Task = {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  status: 'todo' | 'doing' | 'done'
  tags: string[]
}

type Project = {
  id: string
  name: string
  description: string
}

// 业务数据类型
type ProjectState = {
  project: Project
  tasks: Task[]
  members: string[]
  stats: {
    total: number
    completed: number
    inProgress: number
  }
}

// 充血模型：ProjectStore 包含业务逻辑
class ProjectStore extends ReactStore<ProjectState> {
  constructor(project: Project) {
    super({
      project,
      tasks: [],
      members: [],
      stats: { total: 0, completed: 0, inProgress: 0 }
    })
  }

  // 计算派生状态
  protected computedState(state: ProjectState): ProjectState {
    const tasks = state.tasks
    state.stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'doing').length
    }
    return state
  }

  // 业务方法：添加任务
  addTask = (title: string, assignee: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      priority,
      assignee,
      status: 'todo',
      tags: []
    }

    this.setState({
      tasks: op.push(newTask)
    })

    // 自动添加成员
    this.addMember(assignee)
  }

  // 业务方法：更新任务状态
  updateTaskStatus = (taskId: string, status: Task['status']) => {
    this.setState({
      tasks: op.updateAt<Task>(
        op.idIndex(taskId),
        op.partial({ status })
      )
    })
  }

  // 业务方法：添加成员
  addMember = (member: string) => {
    this.setState({
      members: op.add(member)
    })
  }

  // 业务方法：为任务添加标签
  addTaskTag = (taskId: string, tag: string) => {
    this.setState({
      tasks: op.updateAt<Task>(
        op.idIndex(taskId),
        op.partial({ tags: op.add(tag) })
      )
    })
  }

  // 业务查询：获取指定成员的任务
  getTasksByAssignee = (assignee: string) => {
    return this.getState().tasks.filter(t => t.assignee === assignee)
  }

  // 业务查询：获取高优先级任务
  getHighPriorityTasks = () => {
    return this.getState().tasks.filter(t => t.priority === 'high')
  }
}

// Context 定义
const ProjectStoreContext = createContext<ProjectStore | null>(null)

// Hook 获取 Store
function useProjectStore() {
  const store = useContext(ProjectStoreContext)
  if (!store) {
    throw new Error('useProjectStore must be used within ProjectProvider')
  }
  return store
}

// 项目提供者组件
function ProjectProvider({ project, children }: { 
  project: Project
  children: React.ReactNode 
}) {
  // 每个项目实例创建独立的 Store
  const [store] = useState(() => new ProjectStore(project))
  
  return (
    <ProjectStoreContext.Provider value={store}>
      {children}
    </ProjectStoreContext.Provider>
  )
}

// 项目统计组件
function ProjectStats() {
  const store = useProjectStore()
  const stats = store.use(state => state.stats)
  const projectName = store.use(state => state.project.name)

  return (
    <div style={{ 
      padding: '16px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#495057' }}>
        📊 {projectName} 统计
      </h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span>总任务: <strong>{stats.total}</strong></span>
        <span>进行中: <strong>{stats.inProgress}</strong></span>
        <span>已完成: <strong>{stats.completed}</strong></span>
      </div>
    </div>
  )
}

// 任务列表组件
function TaskList() {
  const store = useProjectStore()
  const tasks = store.use(state => state.tasks)

  const statusColors = {
    todo: '#6c757d',
    doing: '#007bff', 
    done: '#28a745'
  }

  const priorityColors = {
    low: '#6c757d',
    medium: '#ffc107',
    high: '#dc3545'
  }

  return (
    <div>
      <h4 style={{ marginBottom: '16px' }}>📋 任务列表</h4>
      {tasks.length === 0 ? (
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>暂无任务</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map(task => (
            <div key={task.id} style={{
              padding: '12px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{task.title}</strong>
                  <span style={{ 
                    marginLeft: '8px', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: priorityColors[task.priority],
                    color: 'white'
                  }}>
                    {task.priority}
                  </span>
                </div>
                <div>
                  <select 
                    value={task.status} 
                    onChange={(e) => store.updateTaskStatus(task.id, e.target.value as Task['status'])}
                    style={{ 
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      color: statusColors[task.status]
                    }}
                  >
                    <option value="todo">待办</option>
                    <option value="doing">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>
                👤 {task.assignee}
                {task.tags.length > 0 && (
                  <span style={{ marginLeft: '12px' }}>
                    🏷️ {task.tags.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 添加任务表单
function AddTaskForm() {
  const store = useProjectStore()
  const members = store.use(state => state.members)
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && assignee.trim()) {
      store.addTask(title.trim(), assignee.trim(), priority)
      setTitle('')
      setAssignee('')
      setPriority('medium')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      padding: '16px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 12px 0' }}>➕ 添加任务</h4>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="任务标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ 
            flex: '1', 
            minWidth: '200px',
            padding: '8px 12px', 
            border: '1px solid #ced4da', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="指派给"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          list="members"
          style={{ 
            flex: '1', 
            minWidth: '120px',
            padding: '8px 12px', 
            border: '1px solid #ced4da', 
            borderRadius: '4px' 
          }}
        />
        <datalist id="members">
          {members.map(member => (
            <option key={member} value={member} />
          ))}
        </datalist>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ced4da', 
            borderRadius: '4px' 
          }}
        >
          <option value="low">低优先级</option>
          <option value="medium">中优先级</option>
          <option value="high">高优先级</option>
        </select>
        <button type="submit" style={{
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          添加
        </button>
      </div>
    </form>
  )
}

// 单个项目组件
function ProjectPanel({ project }: { project: Project }) {
  return (
    <ProjectProvider project={project}>
      <div style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '16px', 
          background: '#e9ecef',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>{project.name}</h3>
          <p style={{ margin: 0, color: '#6c757d' }}>{project.description}</p>
        </div>
        <div style={{ padding: '20px' }}>
          <ProjectStats />
          <AddTaskForm />
          <TaskList />
        </div>
      </div>
    </ProjectProvider>
  )
}

// 主组件：展示多个项目实例
export function MultiInstanceDemo() {
  const projects: Project[] = [
    {
      id: '1',
      name: '🚀 产品开发',
      description: '新产品功能开发和优化'
    },
    {
      id: '2', 
      name: '🐛 Bug修复',
      description: '修复现有系统中的问题'
    },
    {
      id: '3',
      name: '📚 文档更新',
      description: '更新项目文档和用户手册'
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '12px' }}>🏗️ 多实例 Store 示例</h2>
        <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
          每个项目都有独立的 Store 实例，通过 Context 提供给子组件。
          展示了面向对象设计的充血模型，Store 包含完整的业务逻辑。
        </p>
      </div>

      {projects.map(project => (
        <ProjectPanel key={project.id} project={project} />
      ))}
    </div>
  )
} 