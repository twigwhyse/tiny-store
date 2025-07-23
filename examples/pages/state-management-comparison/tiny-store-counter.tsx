import React from "react";
import { ReactStore, op } from "tiny-store";
import { type CounterState, initialState } from "./types";

// =============================================================================
// TinyStore 实现 - 推荐的类继承方式
// =============================================================================
class CounterStore extends ReactStore<CounterState> {
  constructor() {
    super(initialState);
  }

  private addOne = (p: number) => p + 1;
  private subOne = (p: number) => p - 1;

  // 同步操作
  increment = () =>
    this.setState({
      count: this.addOne,
      history: op.push(this.getState().count + 1),
    });

  decrement = () =>
    this.setState({
      count: this.subOne,
      history: op.push(this.getState().count - 1),
    });

  // 异步操作
  incrementAsync = async () => {
    this.setState({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({
      count: this.addOne,
      history: op.push(this.getState().count + 1),
      loading: false,
    });
  };

  reset = () => this.setState(initialState);

  setName = (name: string) => this.setState({ name });
}

const counterStore = new CounterStore();

export function TinyStoreCounter({ code = "" }) {
  const count = counterStore.use((state) => state.count);
  const loading = counterStore.use((state) => state.loading);
  const name = counterStore.use((state) => state.name);
  const historyLength = counterStore.use((state) => state.history.length);

  return (
    <div className="counter-section">
      <h2>🚀 TinyStore (推荐类继承方式)</h2>
      <div className="counter-display">
        <span>
          {name}: {count}
        </span>
        {loading && <span className="loading">Loading...</span>}
      </div>

      <div className="button-group">
        <button onClick={counterStore.increment} disabled={loading}>
          +1
        </button>
        <button onClick={counterStore.decrement} disabled={loading}>
          -1
        </button>
        <button onClick={counterStore.incrementAsync} disabled={loading}>
          +1 (Async)
        </button>
        <button onClick={counterStore.reset} disabled={loading}>
          Reset
        </button>
      </div>

      <div className="input-group">
        <input
          value={name}
          onChange={(e) => counterStore.setName(e.target.value)}
          placeholder="Counter name"
        />
      </div>

      <div className="info">History: {historyLength} steps</div>

      <div className="code-preview">
        <details>
          <summary>代码示例</summary>
          <pre>{code}</pre>
        </details>
      </div>
    </div>
  );
}
