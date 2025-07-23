import { useState } from 'react'
import { TinyStoreCounter } from './state-management-comparison/tiny-store-counter'
import { ZustandCounter } from './state-management-comparison/zustand-counter'
import { ReduxCounter } from './state-management-comparison/redux-counter'
import { comparisonStyles } from './state-management-comparison/styles'
import tinyStoreCode from './state-management-comparison/tiny-store-counter.tsx?raw'
import zustandCode from './state-management-comparison/zustand-counter.tsx?raw'
import reduxCode from './state-management-comparison/redux-counter.tsx?raw'

// =============================================================================
// 主比较组件
// =============================================================================
export function StateManagementComparison() {
  const [activeTab, setActiveTab] = useState('comparison')
  
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{comparisonStyles}</style>
      
      <div className="comparison-container">
        <h1>🔄 状态管理库对比：TinyStore vs Zustand vs Redux</h1>
        
        <div className="tab-bar">
          <button 
            className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            功能对比
          </button>
          <button 
            className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            实时演示
          </button>
        </div>
        
        {activeTab === 'comparison' && (
          <div>
            <h2>📊 特性对比</h2>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>特性</th>
                  <th>TinyStore</th>
                  <th>Zustand</th>
                  <th>Redux</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>学习曲线</strong></td>
                  <td>⭐⭐⭐⭐⭐ 极简</td>
                  <td>⭐⭐⭐⭐ 简单</td>
                  <td>⭐⭐ 复杂</td>
                </tr>
                <tr>
                  <td><strong>样板代码</strong></td>
                  <td>⭐⭐⭐⭐⭐ 最少</td>
                  <td>⭐⭐⭐⭐ 较少</td>
                  <td>⭐⭐ 最多</td>
                </tr>
                <tr>
                  <td><strong>性能</strong></td>
                  <td>⭐⭐⭐⭐⭐ 优秀</td>
                  <td>⭐⭐⭐⭐ 良好</td>
                  <td>⭐⭐⭐ 需优化</td>
                </tr>
                <tr>
                  <td><strong>TypeScript支持</strong></td>
                  <td>⭐⭐⭐⭐⭐ 原生</td>
                  <td>⭐⭐⭐⭐ 良好</td>
                  <td>⭐⭐⭐ 需配置</td>
                </tr>
                <tr>
                  <td><strong>包大小</strong></td>
                  <td>⭐⭐⭐⭐⭐ ~2KB</td>
                  <td>⭐⭐⭐⭐ ~8KB</td>
                  <td>⭐⭐ ~45KB</td>
                </tr>
                <tr>
                  <td><strong>生态系统</strong></td>
                  <td>⭐⭐⭐ 新兴</td>
                  <td>⭐⭐⭐⭐ 成长中</td>
                  <td>⭐⭐⭐⭐⭐ 成熟</td>
                </tr>
                <tr>
                  <td><strong>开发工具</strong></td>
                  <td>⭐⭐⭐ 基础</td>
                  <td>⭐⭐⭐⭐ 良好</td>
                  <td>⭐⭐⭐⭐⭐ 完整</td>
                </tr>
              </tbody>
            </table>
            
            <div className="pros-cons">
              <div className="pros">
                <h4>🚀 TinyStore 优势</h4>
                <ul>
                  <li>极简的API设计，几乎零学习成本</li>
                  <li>推荐类继承方式，代码组织更清晰，封装性更好</li>
                  <li>强大的选择器，精确控制重渲染</li>
                  <li>内置操作符（op）简化数组/对象操作</li>
                  <li>完美的TypeScript支持，类型安全</li>
                  <li>支持计算属性和getter，代码更优雅</li>
                  <li>极小的包体积（~2KB）</li>
                  <li>支持多实例，隔离性好</li>
                </ul>
              </div>
              
              <div className="cons">
                <h4>⚠️ TinyStore 劣势</h4>
                <ul>
                  <li>相对较新，社区生态还在建设中</li>
                  <li>开发工具支持有待完善</li>
                  <li>文档和示例相对较少</li>
                </ul>
              </div>
            </div>
            
            <div className="pros-cons">
              <div className="pros">
                <h4>🐻 Zustand 优势</h4>
                <ul>
                  <li>简单直观的API</li>
                  <li>支持中间件</li>
                  <li>良好的TypeScript支持</li>
                  <li>活跃的社区</li>
                  <li>灵活的架构</li>
                </ul>
              </div>
              
              <div className="cons">
                <h4>⚠️ Zustand 劣势</h4>
                <ul>
                  <li>需要手动优化性能</li>
                  <li>选择器不如TinyStore精确</li>
                  <li>仍需编写一定的样板代码</li>
                </ul>
              </div>
            </div>
            
            <div className="pros-cons">
              <div className="pros">
                <h4>🔴 Redux 优势</h4>
                <ul>
                  <li>成熟稳定的生态系统</li>
                  <li>强大的开发工具</li>
                  <li>时间旅行调试</li>
                  <li>丰富的中间件</li>
                  <li>可预测的状态管理</li>
                </ul>
              </div>
              
              <div className="cons">
                <h4>⚠️ Redux 劣势</h4>
                <ul>
                  <li>大量的样板代码</li>
                  <li>学习曲线陡峭</li>
                  <li>包体积较大</li>
                  <li>配置复杂</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'demo' && (
          <div>
            <h2>🎮 实时演示</h2>
            <p>下面三个计数器实现了相同的功能，但使用了不同的状态管理库。你可以与它们交互来感受不同库的使用体验。</p>
            
            <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', margin: '20px 0', borderLeft: '4px solid #2196f3' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💡 TinyStore 类继承方式的优势：</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>更好的封装性</strong>：状态和操作封装在同一个类中</li>
                <li><strong>类型安全</strong>：TypeScript 提供完整的类型检查和智能提示</li>
                <li><strong>代码组织清晰</strong>：所有相关逻辑集中在一个类中</li>
                <li><strong>支持计算属性</strong>：可以用 getter 定义派生状态</li>
                <li><strong>方法绑定自动</strong>：箭头函数自动绑定 this，直接传递给事件处理器</li>
              </ul>
            </div>
            
            <div className="counters-grid">
              <TinyStoreCounter code={tinyStoreCode} />
              <ZustandCounter code={zustandCode} />
              <ReduxCounter code={reduxCode} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 