# 组件 API 核对

当使用不熟悉、升级后变化或类型报错的 Ant Design/ProComponents API 时读取。

1. 先从 `package.json` 确认实际版本。
2. 优先检查本地 package 的 TypeScript 声明和现有调用点。
3. 需要外部资料时只查对应版本的官方 Ant Design 或 ProComponents 文档。
4. 项目没有安装 `@ant-design/cli`，不要要求执行不存在的 `antd info` 命令。
5. 用 typecheck 与聚焦页面测试证明 props、事件、Form 值和 ref 契约。
6. 不通过 `as any`、私有 DOM selector 或复制内部类型绕过 API 不匹配。
