# Avalon Admin UI 初始化设计

## 背景

在 `C:\Users\baoy\Documents\study\avalon-admin-ui` 新建 Avalon 管理端前端项目。该项目作为独立 Git 仓库维护，直接对接本机 Avalon 后端 `http://localhost:8080`，以 Springdoc 暴露的系统管理 OpenAPI 文档为契约源。

后端已确认提供：

- OpenAPI 系统分组：`http://localhost:8080/v3/api-docs/system`
- 当前登录态：`GET /api/session`
- 系统管理 API：`/api/system/**`
- 自定义 password grant token endpoint：`POST /oauth2/token`

## 目标

- 初始化一个可运行、可验证、可提交的 React 管理端项目。
- 使用 Ant Design Pro 风格技术栈，直接实现系统管理接口的可操作页面。
- 使用 OpenAPI 生成 TypeScript 类型，减少手写 DTO。
- 集成自定义 password grant 登录、后端菜单驱动和 RBAC 权限体验。
- 提供质量工具、Git hooks、CI、Docker、README、LICENSE 和项目内 Agent 约束。

## 非目标

- 不引入 Umi Max / Ant Design Pro 官方重型脚手架。
- 不引入 Playwright、Cypress 或其他 E2E 测试。
- 不实现 OAuth2 授权码 + PKCE 自动登录链路。
- 不修改 `avalon` 后端仓库。
- 不在前端绕过后端 RBAC 强制授权。

## 技术栈

- 包管理器：npm。
- 依赖版本：`package.json` 使用精确版本。
- Runtime：React 19、React DOM 19。
- 构建：Vite 8、TypeScript。
- UI：antd 6、`@ant-design/icons`、`@ant-design/pro-components@3.1.12-0`。
- 样式：Ant Design tokens + Tailwind CSS v4 + 少量普通 CSS。
- 路由：React Router v7。
- 服务端状态：TanStack Query。
- 客户端状态：Zustand。
- API：`openapi-fetch` + `openapi-typescript`。
- 测试：Vitest + Testing Library + jsdom。
- 质量：ESLint flat config + typescript-eslint + Prettier。
- Git hooks：Husky + lint-staged。

## 依赖版本策略

初始化时使用 npm registry 当前最新版本，并写入精确版本。已确认的关键版本：

- `react` / `react-dom`: `19.2.7`
- `antd`: `6.4.5`
- `@ant-design/icons`: `6.2.5`
- `@ant-design/pro-components`: `3.1.12-0`
- `@tanstack/react-query`: `5.101.1`
- `react-router-dom`: `7.18.0`
- `zustand`: `5.0.14`
- `vite`: `8.1.0`
- `typescript`: `6.0.3`
- `vitest`: `4.1.9`
- `tailwindcss` / `@tailwindcss/vite`: `4.3.1`
- `openapi-fetch`: `0.17.0`
- `openapi-typescript`: `7.13.0`
- `husky`: `9.1.7`
- `lint-staged`: `17.0.8`

`@ant-design/pro-components@3.1.12-0` 的 peer dependencies 已确认支持 `antd ^6.0.0` 和 `react >=18.0.0`。

## 目录结构

```text
avalon-admin-ui
├── .codex/skills
├── .github/workflows
├── .husky
├── docker
├── docs/superpowers/specs
├── public
├── scripts
├── src
│   ├── app
│   ├── components
│   ├── pages
│   │   ├── dashboard
│   │   └── system
│   │       ├── oauth
│   │       ├── rbac
│   │       └── scheduler
│   ├── services
│   │   └── generated
│   ├── shared
│   └── test
├── AGENTS.md
├── Dockerfile
├── LICENSE
├── README.md
├── package.json
└── vite.config.ts
```

职责边界：

- `src/app`：providers、路由、布局、主题、应用级状态装配。
- `src/services`：OpenAPI 生成物、typed client、认证、系统 API service。
- `src/pages`：业务页面，默认按 `src/pages/<domain>/<feature>/` 组织。
- `src/shared`：通用 hooks、权限判断、表格适配、错误处理、类型辅助。
- `src/components`：跨页面复用组件。

## 认证与权限

登录页直接对接后端自定义 password grant。

请求：

- URL：`/oauth2/token`
- Method：`POST`
- Content-Type：`application/x-www-form-urlencoded`
- Client 认证：HTTP Basic
- 表单参数：
  - `grant_type=urn:security:params:oauth:grant-type:password`
  - `username`
  - `password`
  - `scope=security:admin battle-rules:admin battle-sandbox:run game-data:admin`

开发环境默认值：

```env
VITE_OAUTH_CLIENT_ID=system-admin-jwt
VITE_OAUTH_CLIENT_SECRET=system-admin-jwt-secret
VITE_OAUTH_SCOPE=security:admin battle-rules:admin battle-sandbox:run game-data:admin
```

`.env.example` 必须标注生产环境需要替换 client secret。

token 策略：

- access token 存储在 `sessionStorage`。
- 登录成功后调用 `GET /api/session`。
- session 响应中的 `user`、`roles`、`accessNodeCodes` 和 `menus` 作为前端布局、路由和按钮权限输入。
- 401 时清理 token 和 session，跳转登录页。
- 前端权限只用于交互体验；后端继续强制校验 `/api/system/**` 权限。

## OpenAPI 与请求层

契约源为 `http://localhost:8080/v3/api-docs/system`。

脚本：

- `openapi:pull`：拉取 OpenAPI JSON 到 `src/services/generated/openapi.json`。
- `openapi:generate`：通过 `openapi-typescript` 生成 `src/services/generated/schema.d.ts`。
- `openapi:sync`：串联 pull 和 generate。

请求层：

- 使用 `openapi-fetch` 创建 typed client。
- 统一注入 Bearer token。
- 统一处理后端错误响应 `{ code, message, field }`。
- 支持 JSON 请求和 password grant 的 form 请求。
- 业务 service 不重复声明后端 DTO，优先从生成的 `paths` 类型推导请求和响应。

分页适配：

- 后端 Jimmer `Page` 统一转换为 ProTable 所需的 `data`、`success`、`total`。
- ProTable 的 1-based 页码转换为后端 0-based `page`。
- `size` 默认不超过后端约束的 100。

## 页面范围

首版直接实现可操作系统管理页面。

### 工作台

- 显示当前用户、角色、权限数量、菜单数量。
- 显示系统接口状态。
- 提供系统管理快捷入口。

### 用户管理

路径对应 `system/rbac/users`。

能力：

- 列表、分页、搜索。
- 按角色、启用状态、锁定状态筛选。
- 创建用户。
- 查看详情。
- 启用、禁用。
- 锁定、解锁。
- 重置密码。
- 更新角色绑定。

### 角色管理

路径对应 `system/rbac/roles`。

能力：

- 列表、分页、搜索。
- 按访问节点筛选。
- 创建角色。
- 编辑角色名称和访问节点绑定。
- 查看详情。

### 访问节点

路径对应 `system/rbac/access-nodes`。

能力：

- 列表、分页、搜索。
- 按 `codePrefix`、`type`、`visible`、`enabled` 筛选。
- 查看详情。

### OAuth Client

路径对应 `system/oauth/clients`。

能力：

- 列表、分页、搜索。
- 创建 client。
- 编辑 client 名称、scopes、token 格式和 TTL。
- 重置 client secret。
- 查看详情。

### JWK

路径对应 `system/oauth/jwks`。

能力：

- 列表、分页、搜索。
- 查看详情。
- 轮换 JWK。

### 定时任务

路径对应 `system/scheduler/tasks`。

能力：

- 列表、分页、搜索。
- 创建任务。
- 编辑任务。
- 启用、禁用。
- 手动触发。
- 删除。
- 查看详情。
- 查看执行记录。

## 页面交互

- 列表使用 `ProTable`。
- 创建和编辑使用 `ModalForm`。
- 详情使用 `Drawer`。
- 危险或不可逆操作使用 `Popconfirm`。
- 远程数据统一走 React Query。
- 页面必须处理 loading、empty、error、permission denied 和 reload 状态。
- 表格行必须有稳定 `rowKey`。
- 远程搜索和筛选不启用本地过滤。

## 路由、菜单与布局

- 使用 React Router v7 路由对象。
- 前端维护 `componentKey -> React page` 映射。
- 登录后优先使用 `/api/session` 返回的 `menus` 渲染侧边栏。
- 后端菜单为空时，使用前端内置基础菜单作为开发兜底，并保持权限受限状态。
- 路由元数据包含标题、权限 code、面包屑和 component key。
- 未授权路由显示 403。
- 未知路由显示 404。
- 布局采用 ProLayout 风格。
- 顶部显示当前用户和退出登录。
- `ConfigProvider` 统一配置中文 locale、主题 token 和管理端密度。
- Tailwind 只用于页面级布局、间距和响应式工具类，不覆盖 antd 内部 DOM。

## 环境变量

提供：

- `.env.example`
- `.env.development`
- `.env.production`

默认值：

```env
VITE_API_BASE_URL=/api
VITE_OAUTH_TOKEN_URL=/oauth2/token
VITE_OAUTH_CLIENT_ID=system-admin-jwt
VITE_OAUTH_CLIENT_SECRET=system-admin-jwt-secret
VITE_OAUTH_SCOPE=security:admin battle-rules:admin battle-sandbox:run game-data:admin
VITE_OPENAPI_URL=http://localhost:8080/v3/api-docs/system
```

Vite dev server 固定端口 `5173`，代理：

- `/api` -> `http://localhost:8080`
- `/oauth2` -> `http://localhost:8080`
- `/v3` -> `http://localhost:8080`

## 质量与验证

脚本：

- `dev`
- `build`
- `preview`
- `lint`
- `lint:fix`
- `format`
- `format:fix`
- `typecheck`
- `test`
- `test:watch`
- `openapi:pull`
- `openapi:generate`
- `openapi:sync`

测试覆盖：

- password grant token 请求构造。
- session 加载和 token 恢复。
- 权限判断。
- 请求错误映射。
- ProTable 分页适配。
- 关键页面基础渲染。

完成前验证：

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

如修改 antd 组件代码，按全局 antd 技能要求先查询组件 API，修改后运行 `antd lint <changed-path> --format json`。

## Git、Hooks 与提交

- 在 `avalon-admin-ui` 内执行 `git init`。
- 使用 Husky 初始化 pre-commit。
- lint-staged 处理：
  - `*.{ts,tsx,js,jsx}`：ESLint fix + Prettier。
  - `*.{json,md,css,html,yml,yaml}`：Prettier。
- 初始化验证通过后创建首个 commit：

```text
chore: initialize avalon admin ui
```

## CI 与部署

GitHub Actions CI：

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

Docker：

- `Dockerfile` 使用 Node 构建静态资源，再用 Nginx 托管。
- `.dockerignore` 排除 `node_modules`、`dist`、缓存、日志和本地环境文件。
- 不加入复杂发布流程。

## 项目内 Agent 约束

初始化：

- `AGENTS.md`
- `.codex/skills/react-antd/SKILL.md`
- `.codex/skills/api-auth/SKILL.md`
- `.codex/skills/source-comments/SKILL.md`
- `.codex/skills/commit/SKILL.md`

约束重点：

- 先读项目技能再改代码。
- Ant Design / ProComponents 代码遵循官方 API 和 tokens 优先。
- OpenAPI typed client 优先，避免手写重复 DTO。
- password grant 和 session 权限逻辑集中封装。
- 页面默认放在 `src/pages/<domain>/<feature>/`。
- 不绕过后端菜单和权限模型。
- 新增注释和项目说明优先中文，专有名词保留英文。

## 风险与缓解

- `@ant-design/pro-components@3.1.12-0` 是预发布版本，可能存在 API 变化。缓解：严格使用文档和 CLI 查询，改动后运行 antd lint。
- password grant 在浏览器端使用 client secret 有安全风险。缓解：仅按当前后端自定义管理端需求实现，`.env.example` 明确生产替换要求，后续可迁移到 BFF 或 PKCE。
- OpenAPI 依赖本地后端运行。缓解：提交生成后的 `openapi.json` 和 `schema.d.ts`，CI 不依赖本地后端即可类型检查。
- 首版页面范围较大。缓解：共享表格、表单、错误和权限适配，按资源边界实现，避免页面层重复 DTO 和请求逻辑。
