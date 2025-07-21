# 贡献指南

感谢您对 Tiny Store 项目的关注！以下是参与项目开发的指南。

## 🚀 开发环境设置

### 预备条件
- Node.js >= 16
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发脚本
```bash
# 构建项目
pnpm build

# 监视模式构建
pnpm dev

# 运行测试
pnpm test

# 测试UI界面
pnpm test:ui

# 类型检查
pnpm typecheck
```

## 📁 项目结构

```
src/
├── Store.ts              # 核心 Store 类
├── ReactStore.ts         # React 特化版本
├── useStore.ts           # React Hook
├── immutable/            # 不可变操作工具
│   ├── index.ts
│   ├── operators.ts      # 操作符函数
│   ├── compare.ts        # 比较函数
│   ├── primitive.ts      # 原始类型定义
│   └── update-object.ts  # 对象更新工具
├── __tests__/           # 单元测试
└── index.ts             # 导出入口

examples/                # 使用示例
debug/                   # 开发测试文件 (不会被发布)
```

## 🛠 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 优先使用 `const` 和 `let`，避免 `var`
- 函数优先使用 arrow function，除非需要 `this` 绑定
- 接口命名使用 PascalCase
- 文件名使用 PascalCase (类文件) 或 camelCase (工具文件)

### 类型安全
- 所有公开 API 必须有完整的类型定义
- 避免使用 `any`，必要时使用 `unknown`
- 使用泛型提供类型推导
- 导出的类型必须有清晰的文档注释

### 测试要求
- 新功能必须有对应的单元测试
- 测试覆盖率应保持在 90% 以上
- 测试用例应覆盖正常流程和边界情况
- 使用描述性的测试名称

### 性能考虑
- 避免不必要的对象创建
- 优化不可变操作的性能
- 状态更新时进行浅比较优化
- 避免内存泄漏（正确处理事件监听器）

## 📝 提交规范

### Commit Message 格式
```
<type>(<scope>): <description>

<body>

<footer>
```

#### Type 类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建流程、工具变动

#### 示例
```
feat(immutable): add compose operator for function composition

Add compose function that allows right-to-left function composition,
complementing the existing pipe operator.

Closes #123
```

## 🧪 测试指南

### 运行测试
```bash
# 运行所有测试
pnpm test

# 监视模式
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

### 测试结构
- 每个功能模块都应有对应的测试文件
- 测试文件位于 `src/__tests__/` 目录
- 使用 `describe` 分组相关测试
- 使用清晰的测试描述

## 🔄 发布流程

### 版本规范
遵循 [Semantic Versioning](https://semver.org/)：
- `MAJOR`: 破坏性变更
- `MINOR`: 新增功能（向后兼容）
- `PATCH`: Bug 修复（向后兼容）

### 发布检查清单
- [ ] 所有测试通过
- [ ] 类型检查通过
- [ ] 文档更新完整
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新

## 💡 功能建议

我们欢迎以下类型的贡献：

### 优先级高
- 性能优化
- TypeScript 类型改进
- 测试覆盖率提升
- 文档完善

### 新功能建议
- 更多不可变操作工具
- DevTools 支持
- SSR 支持优化
- 中间件系统
- 状态持久化工具

### 不推荐的功能
- 复杂的异步状态管理（推荐使用专门的库）
- 路由功能（超出库的职责范围）
- UI 组件（保持库的纯状态管理定位）

## 🤝 贡献流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Pull Request 要求
- 清晰的标题和描述
- 相关的测试用例
- 文档更新（如适用）
- 通过所有 CI 检查

## 📞 获取帮助

- 查看 [Issues](../../issues) 了解已知问题
- 创建新的 Issue 报告 Bug 或提出功能建议
- 参与 [Discussions](../../discussions) 进行技术讨论

谢谢您的贡献！🎉 