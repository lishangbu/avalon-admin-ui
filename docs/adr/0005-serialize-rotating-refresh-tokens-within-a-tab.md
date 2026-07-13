# Serialize rotating refresh tokens within a tab

Web 应用在当前标签页会话中保存公共 password client 的旋转 refresh token，不使用 Cookie 或跨浏览器重启的持久存储；同一标签页的并发请求共享一个刷新操作，其余请求等待结果，避免正常并发重放已经轮换的 token。成功刷新继续使用原 Trainer Session，刷新失败则重新登录，Match 本身仍按服务端期限推进。
