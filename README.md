# Avalon Admin UI

Avalon Admin UI 是 Avalon 后端的管理端前端。项目使用 React、Vite、Ant Design 6、ProComponents、TanStack Query 和 OpenAPI 类型生成，对接本机后端系统管理接口。

## 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm `>=10`
- Avalon 后端运行在 `http://localhost:8080`
- Docker 可选，仅在容器构建或联调后端依赖时需要

## 开发命令

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:5173
```

Vite 会代理这些路径到后端：

- `/api`
- `/oauth2`
- `/v3`

## 登录配置

开发环境默认使用后端 password grant：

```env
VITE_OAUTH_TOKEN_URL=/oauth2/token
VITE_OAUTH_CLIENT_ID=system-admin-opaque
VITE_OAUTH_CLIENT_SECRET=system-admin-opaque-secret
VITE_OAUTH_SCOPE=security:admin battle-rules:admin battle-sandbox:run game-data:admin
```

生产环境必须替换 client secret。前端只将 access token 保存在 `sessionStorage`，当前用户、菜单和权限来自 `GET /api/session`。

## OpenAPI 同步

后端管理端 OpenAPI 文档地址：

```text
http://localhost:8080/v3/api-docs/admin
```

同步命令：

```bash
npm run openapi:sync
```

生成物：

- `src/services/generated/openapi.json`
- `src/services/generated/schema.d.ts`

## 质量检查

```bash
npm run verify
```

`verify` 会依次执行类型检查、ESLint、Vitest、生产构建和菜单 smoke。默认 smoke 会访问本机
`http://localhost:5173` 与后端 `http://localhost:8080`；CI 使用
`AVALON_E2E_MOCK=1` 只模拟登录态、菜单树和空分页响应，确保菜单和页面渲染契约不依赖真实数据库。

## 容器构建

```bash
docker build -t avalon-admin-ui .
docker run --rm -p 8081:80 avalon-admin-ui
```

容器内 Nginx 会托管 Vite 构建产物，并将 `/api`、`/oauth2` 和 `/v3` 代理到 `host.docker.internal:8080`。
