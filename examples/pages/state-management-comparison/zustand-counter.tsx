import React from "react";
import { create } from "zustand";
import { type CounterState, initialState } from "./types";

// =============================================================================
// Zustand 实现
// =============================================================================
interface ZustandStore extends CounterState {
  increment: () => void;
  decrement: () => void;
  incrementAsync: () => Promise<void>;
  reset: () => void;
  setName: (name: string) => void;
}

const useZustandStore = create<ZustandStore>((set, get) => ({
  ...initialState,

  increment: () =>
    set((state) => ({
      count: state.count + 1,
      history: [...state.history, state.count + 1],
    })),

  decrement: () =>
    set((state) => ({
      count: state.count - 1,
      history: [...state.history, state.count - 1],
    })),

  incrementAsync: async () => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentCount = get().count;
    set((state) => ({
      count: currentCount + 1,
      history: [...state.history, currentCount + 1],
      loading: false,
    }));
  },

  reset: () => set(initialState),

  setName: (name: string) => set({ name }),
}));

export function ZustandCounter({ code = "" }) {
  const {
    count,
    loading,
    name,
    history,
    increment,
    decrement,
    incrementAsync,
    reset,
    setName,
  } = useZustandStore();

  return (
    <div className="counter-section">
      <h2>🐻 Zustand</h2>
      <div className="counter-display">
        <span>
          {name}: {count}
        </span>
        {loading && <span className="loading">Loading...</span>}
      </div>

      <div className="button-group">
        <button onClick={increment} disabled={loading}>
          +1
        </button>
        <button onClick={decrement} disabled={loading}>
          -1
        </button>
        <button onClick={incrementAsync} disabled={loading}>
          +1 (Async)
        </button>
        <button onClick={reset} disabled={loading}>
          Reset
        </button>
      </div>

      <div className="input-group">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Counter name"
        />
      </div>

      <div className="info">History: {history.length} steps</div>

      <div className="code-preview">
        <details>
          <summary>代码示例</summary>
          <pre>{code}</pre>
        </details>
      </div>
    </div>
  );
}
