import React from "react";
import { ReactStore, op } from "@eoyo/tiny-store";

// 定义数据类型
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
  createdAt: number;
};

type User = {
  name: string;
  avatar: string;
};

type AppState = {
  todos: Todo[];
  user: User;
  filters: {
    showCompleted: boolean;
    selectedTags: string[];
  };
};

// 工具函数
const generateId = () => Math.random().toString(36).substr(2, 9);
class TodoStore extends ReactStore<AppState> {
  constructor() {
    super({
      todos: [],
      user: { name: "Guest", avatar: "👤" },
      filters: {
        showCompleted: true,
        selectedTags: [],
      },
    });
  }

  completedTodos = this.selector(
    [s => s.todos],
    (todos) => todos.filter((t) => t.completed)
  );

  stats = this.selector(
    [(s) => s.todos.length, (s) => this.completedTodos(s).length],
    (total, completed) => ({
      total,
      completed,
    })
  );

  filteredTodos = this.selector([
    (s) => s.filters.showCompleted,
    (s) => s.filters.selectedTags,
    (s) => s.todos,
  ], (showCompleted, selectedTags, todos) => {
    return todos.filter((todo) => {
      if (!showCompleted && todo.completed) return false;
      if (selectedTags.length > 0) {
        return selectedTags.some((tag) => todo.tags.includes(tag));
      }
      return true;
    });
  });

  addTodo = (text: string, tags: string[] = []) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      tags,
      createdAt: Date.now(),
    };

    this.setState({
      todos: op.push(newTodo),
    });
  };

  toggleTodo = (id: string) => {
    this.setState({
      todos: op.updateAt<Todo>(
        op.idIndex(id),
        op.partial({ completed: (v) => !v })
      ),
    });
  };

  addTagToTodo = (todoId: string, tag: string) => {
    this.setState({
      todos: op.updateAt<Todo>(
        op.idIndex(todoId),
        op.partial({ tags: op.add(tag) })
      ),
    });
  };

  removeTagFromTodo = (todoId: string, tag: string) => {
    this.setState({
      todos: op.updateAt<Todo>(
        op.idIndex(todoId),
        op.partial({ tags: op.remove(tag) })
      ),
    });
  };

  updateFilters = (filters: Partial<AppState["filters"]>) => {
    this.setState({
      filters: op.partial(filters),
    });
  };

  setUser = (user: Partial<User>) => {
    this.setState({
      user: op.partial(user),
    });
  };

  deleteTodo = (id: string) => {
    this.setState({
      todos: op.remove(op.idIs(id)),
    });
  };
}

const todoStore = new TodoStore();

// React 组件
export function TodoApp() {
  const todos = todoStore.use((s) => s.todos);
  const user = todoStore.use((s) => s.user);
  const filters = todoStore.use((s) => s.filters);
  const stats = todoStore.use(todoStore.stats);

  // 过滤后的待办事项
  const filteredTodos = todoStore.use(todoStore.filteredTodos);

  // 获取所有标签
  const allTags = Array.from(new Set(todos.flatMap((todo) => todo.tags)));

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* 用户信息 */}
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1>
          {user.avatar} {user.name}'s Todos
        </h1>
        <div>
          <input
            placeholder="Your name"
            value={user.name}
            onChange={(e) => todoStore.setUser({ name: e.target.value })}
            style={{ padding: "5px" }}
          />
        </div>
      </header>

      {/* 统计信息 */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <strong>统计: </strong>
        总计 {stats.total} 项，已完成 {stats.completed} 项
      </div>

      {/* 过滤器 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={filters.showCompleted}
            onChange={(e) =>
              todoStore.updateFilters({ showCompleted: e.target.checked })
            }
          />
          显示已完成
        </label>

        <div style={{ marginTop: "10px" }}>
          <strong>按标签筛选: </strong>
          {allTags.map((tag) => (
            <label key={tag} style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                checked={filters.selectedTags.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    todoStore.updateFilters({
                      selectedTags: op.add(tag)(filters.selectedTags),
                    });
                  } else {
                    todoStore.updateFilters({
                      selectedTags: op.remove(tag)(filters.selectedTags),
                    });
                  }
                }}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      {/* 添加待办 */}
      <AddTodoForm onAdd={todoStore.addTodo} />

      {/* 待办列表 */}
      <div>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => todoStore.toggleTodo(todo.id)}
            onDelete={() => todoStore.deleteTodo(todo.id)}
            onAddTag={(tag) => todoStore.addTagToTodo(todo.id, tag)}
            onRemoveTag={(tag) => todoStore.removeTagFromTodo(todo.id, tag)}
          />
        ))}
      </div>
    </div>
  );
}

// 添加待办表单组件
function AddTodoForm({
  onAdd,
}: {
  onAdd: (text: string, tags?: string[]) => void;
}) {
  const [text, setText] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      onAdd(text.trim(), tags);
      setText("");
      setTagInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="添加新的待办事项..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "300px", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="标签 (用逗号分隔)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          style={{ width: "300px", padding: "8px" }}
        />
      </div>
      <button type="submit" style={{ padding: "8px 16px" }}>
        添加
      </button>
    </form>
  );
}

// 待办项组件
function TodoItem({
  todo,
  onToggle,
  onDelete,
  onAddTag,
  onRemoveTag,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  const [newTag, setNewTag] = React.useState("");

  const addTag = () => {
    if (newTag.trim() && !todo.tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "5px",
        background: todo.completed ? "#f9f9f9" : "white",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          style={{ marginRight: "10px" }}
        />
        <span
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
            flex: 1,
          }}
        >
          {todo.text}
        </span>
        <button onClick={onDelete} style={{ color: "red", marginLeft: "10px" }}>
          删除
        </button>
      </div>

      <div style={{ fontSize: "0.9em" }}>
        <div style={{ marginBottom: "5px" }}>
          <strong>标签: </strong>
          {todo.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#e1f5fe",
                padding: "2px 6px",
                margin: "0 5px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
              onClick={() => onRemoveTag(tag)}
              title="点击删除"
            >
              {tag} ×
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="添加标签"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            style={{ padding: "2px 6px", fontSize: "0.8em", width: "100px" }}
          />
          <button
            onClick={addTag}
            style={{ marginLeft: "5px", fontSize: "0.8em" }}
          >
            +
          </button>
        </div>

        <div style={{ color: "#999", fontSize: "0.8em", marginTop: "5px" }}>
          创建于: {todo.createdAt.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export { todoStore };
