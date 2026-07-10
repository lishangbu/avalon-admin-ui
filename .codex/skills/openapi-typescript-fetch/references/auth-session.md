# 认证与 Session

当登录、token、session、401 或权限体验变化时读取。

- 登录使用后端当前 OAuth2 自定义 grant 与 HTTP Basic client 认证，不在 UI 硬编码 secret。
- access token 只保存在 `sessionStorage`，不进入 localStorage、URL 或日志。
- `GET /api/session` 是当前用户、角色、访问节点和菜单的权威来源。
- 401 或 session 加载失败清理 token 并返回登录态；403 保留登录态并显示无权限。
- 菜单、路由和按钮权限只改善体验，后端必须独立拒绝未授权请求。
- 测试覆盖登录成功/失败、刷新页面、401 清理、403、退出和权限变化。
