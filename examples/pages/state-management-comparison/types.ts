// =============================================================================
// 共同的状态类型定义
// =============================================================================
export interface CounterState {
  count: number
  history: number[]
  loading: boolean
  name: string
}

export const initialState: CounterState = {
  count: 0,
  history: [0],
  loading: false,
  name: 'Counter'
} 