---
name: source-comments
description: 'Use when adding or reviewing Avalon Admin UI source comments, user-facing copy, or explanatory documentation.'
---

# 注释与文案

## 注释

- 源码注释使用中文。
- 只解释边界、协议、权限、缓存、错误处理等不容易从代码直接看出的原因。
- 不写逐行复述式注释。
- 公共 helper 或跨页面复用组件可以用简短注释说明复用边界。

## 文案

- 用户可见文案使用清晰中文。
- API 字段、权限 code、环境变量和类型名保持英文。
- 错误信息不暴露 token、secret、SQL、堆栈或内部类名。
