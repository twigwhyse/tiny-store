import React from 'react'
import { createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { type CounterState, initialState } from './types'

// =============================================================================
// Redux 实现
// =============================================================================

// Action Types
const REDUX_INCREMENT = 'REDUX_INCREMENT'
const REDUX_DECREMENT = 'REDUX_DECREMENT'
const REDUX_INCREMENT_ASYNC_START = 'REDUX_INCREMENT_ASYNC_START'
const REDUX_INCREMENT_ASYNC_SUCCESS = 'REDUX_INCREMENT_ASYNC_SUCCESS'
const REDUX_RESET = 'REDUX_RESET'
const REDUX_SET_NAME = 'REDUX_SET_NAME'

// Action Creators
const reduxActions = {
  increment: () => ({ type: REDUX_INCREMENT }),
  decrement: () => ({ type: REDUX_DECREMENT }),
  incrementAsyncStart: () => ({ type: REDUX_INCREMENT_ASYNC_START }),
  incrementAsyncSuccess: () => ({ type: REDUX_INCREMENT_ASYNC_SUCCESS }),
  reset: () => ({ type: REDUX_RESET }),
  setName: (name: string) => ({ type: REDUX_SET_NAME, payload: name }),
  
  // Thunk for async action
  incrementAsync: () => async (dispatch: any) => {
    dispatch(reduxActions.incrementAsyncStart())
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(reduxActions.incrementAsyncSuccess())
  }
}

// Reducer
function reduxReducer(state = initialState, action: any): CounterState {
  switch (action.type) {
    case REDUX_INCREMENT:
      return {
        ...state,
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      }
    case REDUX_DECREMENT:
      return {
        ...state,
        count: state.count - 1,
        history: [...state.history, state.count - 1]
      }
    case REDUX_INCREMENT_ASYNC_START:
      return { ...state, loading: true }
    case REDUX_INCREMENT_ASYNC_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
        history: [...state.history, state.count + 1],
        loading: false
      }
    case REDUX_RESET:
      return initialState
    case REDUX_SET_NAME:
      return { ...state, name: action.payload }
    default:
      return state
  }
}

const reduxStore = createStore(reduxReducer)

function ReduxCounterInner({ code = "" }) {
  const count = useSelector((state: CounterState) => state.count)
  const loading = useSelector((state: CounterState) => state.loading)
  const name = useSelector((state: CounterState) => state.name)
  const history = useSelector((state: CounterState) => state.history)
  const dispatch = useDispatch()
  
  return (
    <div className="counter-section">
      <h2>🔴 Redux</h2>
      <div className="counter-display">
        <span>{name}: {count}</span>
        {loading && <span className="loading">Loading...</span>}
      </div>
      
      <div className="button-group">
        <button onClick={() => dispatch(reduxActions.increment())} disabled={loading}>+1</button>
        <button onClick={() => dispatch(reduxActions.decrement())} disabled={loading}>-1</button>
        <button onClick={() => dispatch(reduxActions.incrementAsync() as any)} disabled={loading}>
          +1 (Async)
        </button>
        <button onClick={() => dispatch(reduxActions.reset())} disabled={loading}>Reset</button>
      </div>
      
      <div className="input-group">
        <input 
          value={name}
          onChange={(e) => dispatch(reduxActions.setName(e.target.value))}
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
  )
}

export function ReduxCounter({ code = "" }) {
  return (
    <Provider store={reduxStore}>
      <ReduxCounterInner code={code} />
    </Provider>
  )
}
