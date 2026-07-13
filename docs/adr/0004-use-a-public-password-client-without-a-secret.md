# Use a public password client without a secret

Web 应用继续通过 Avalon 自定义 password grant 直接提交用户名和密码，但改用无 client secret 的公共客户端，不再编译、保存或发送 `VITE_OAUTH_CLIENT_SECRET` 与 HTTP Basic 凭据。管理员和普通玩家共用该登录入口，后端 authority 仍只限制管理 API，生产环境必须通过 HTTPS 传输。
