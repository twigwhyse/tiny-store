# 性能测试对比页面

这个页面提供了 TinyStore 操作符、Immer 和 Immutable.js 之间的全面性能对比测试。

## 🚀 启动测试

```bash
npm run examples
```

然后在浏览器中选择"性能测试对比"页面。

## 📊 测试场景

### 1. 深度更新用户名
测试在复杂对象结构中更新单个属性的性能：
- **TinyStore**: `op.partial` + `op.updateAt` + `op.partial`
- **Immer**: `produce` + draft 修改
- **Immutable.js**: `setIn` 路径更新

### 2. 添加新用户
测试添加新元素并同时更新统计信息的性能：
- **TinyStore**: `op.partial` + `op.push` + 函数更新器
- **Immer**: `produce` + `push` + 直接赋值
- **Immutable.js**: `updateIn` 组合操作

### 3. 批量更新标签
测试批量更新多个对象属性的性能：
- **TinyStore**: `op.pipe` + 多个 `op.updateAt` 操作
- **Immer**: `produce` + 循环修改 draft
- **Immutable.js**: 链式 `updateIn` 调用

### 4. 深度嵌套更新
测试在深层嵌套结构中更新多个属性的性能：
- **TinyStore**: `op.partial` + `op.updateAt` + `op.deepPartial`
- **Immer**: `produce` + 深度 draft 修改
- **Immutable.js**: 多个 `setIn` 调用

## 🔧 测试配置

### 数据规模选项
- **10 条记录**: 轻量级测试，适合快速验证
- **100 条记录**: 中等规模，常见应用场景
- **1000 条记录**: 大型数据集，性能差异明显
- **5000 条记录**: 重负载测试，压力测试场景

### 测试指标
- **操作次数**: 每个测试执行的迭代次数
- **总耗时**: 完成所有操作的总时间 (ms)
- **平均耗时**: 单次操作的平均时间 (ms)
- **性能**: 每秒操作数 (ops/sec) - 主要性能指标

## 📈 结果解读

### 性能对比条形图
- **蓝色**: TinyStore 操作符
- **橙色**: Immer
- **紫色**: Immutable.js

获胜者会显示 🏆 图标和绿色边框。

### 预期结果

基于设计理念，预期的性能表现：

1. **简单更新**: TinyStore ≈ Immutable.js > Immer
2. **复杂更新**: TinyStore > Immutable.js > Immer  
3. **批量操作**: TinyStore > Immutable.js > Immer
4. **深度嵌套**: TinyStore ≈ Immutable.js > Immer

## 🔍 为什么 TinyStore 更快？

### 1. **引用相等优化**
```typescript
// 当没有实际变化时，TinyStore 返回原始引用
const result = op.partial({ name: 'Alice' })(user) // user.name 已经是 'Alice'
console.log(result === user) // true - 避免了不必要的对象创建
```

### 2. **零运行时开销**
- 无 Proxy 包装 (Immer 使用 Proxy)
- 无运行时类型转换 (Immutable.js 需要 fromJS/toJS)
- 纯函数组合，编译时优化

### 3. **精确的变更检测**
```typescript
// TinyStore 在对象级别检测变化
function updateObject(obj, updates) {
  let hasChanged = false
  // 只有真正变化时才创建新对象
  return hasChanged ? newObj : obj
}
```

### 4. **优化的数据结构操作**
```typescript
// 数组/Set 操作的智能去重
op.add('existing-item')(array) === array // 返回原数组
op.remove('non-existent')(array) === array // 返回原数组
```

## 🎯 实际应用建议

### 选择 TinyStore 当：
- 需要最佳 TypeScript 体验
- 性能是关键考量
- 使用 React 18+ 和现代构建工具
- 团队熟悉函数式编程

### 选择 Immer 当：
- 团队习惯命令式更新语法
- 需要成熟的生态系统
- 与现有 Redux Toolkit 集成

### 选择 Immutable.js 当：
- 需要强制不可变性
- 使用大量复杂数据结构
- 性能要求不是第一优先级

## 🧪 自定义测试

你可以修改 `examples/pages/performance-test.tsx` 来添加自己的测试场景：

```typescript
// 添加新的测试场景
const customTest = benchmark('Custom Test', () => {
  // 你的测试代码
}, iterations)
```

测试结果会帮助你为特定的使用场景选择最合适的不可变数据方案。 