---
name: tanstack-query
description: 'TanStack Query work in Avalon Admin UI. Use when changing useQuery, useMutation, QueryClient, query keys, caching, invalidation, retries, pagination queries, optimistic updates, loading states, or service-state integration.'
---

# TanStack Query

## 修改前

- 从 `package.json` 确认 TanStack Query 版本，检查 provider、query key、service 与页面测试。
- 涉及请求类型或认证时同时加载 `openapi-typescript-fetch`。
- 先明确数据是服务端状态还是本地交互状态，避免复制。

## 项目要求

- query key 使用稳定结构并包含所有影响结果的参数；不要把新对象或函数作为不稳定 key。
- queryFn 只调用 service，不读取页面可变闭包中的隐式参数。
- 使用 `enabled` 表达依赖数据尚未就绪，不在 queryFn 内静默返回假数据。
- mutation 成功后精确更新或失效相关 key；不要无差别清空全部缓存。
- mutation pending 时禁用重复操作；错误通过共享错误能力呈现。
- 谨慎使用 optimistic update；必须实现 rollback，并证明延迟场景有体验收益。
- 分页、筛选和搜索在后端执行；保留上一页数据时明确视觉反馈。
- 不把 query data 复制到长期本地 state；表单草稿例外，但要定义初始化和重置时机。

## 测试驱动

- 先 mock service 或底层 client，覆盖加载、成功、失败、失效与并发点击。
- query key 或缓存策略变更添加能发现陈旧数据和串页的回归测试。
- 不用任意 sleep 等待 query；使用 Testing Library 的异步查询。

## 完成标准

- 聚焦页面/service 测试通过，typecheck 通过。
- query key 完整稳定，mutation 后目标数据可观察更新。
- 无重复服务端状态、缓存污染、吞错或无限重试。
- 跨页面缓存行为变化运行相关页面集合测试。
