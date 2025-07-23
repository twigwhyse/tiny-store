/// <reference types="vite/client" />

// 声明 ?raw 查询参数的模块类型
declare module '*.tsx?raw' {
  const content: string
  export default content
}

declare module '*.ts?raw' {
  const content: string
  export default content
}

declare module '*.js?raw' {
  const content: string
  export default content
}

declare module '*.jsx?raw' {
  const content: string
  export default content
} 