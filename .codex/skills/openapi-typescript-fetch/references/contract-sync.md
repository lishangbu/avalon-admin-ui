# Contract Snapshot 同步

当后端 admin OpenAPI 发生变化时读取。

1. 先确认后端契约测试已通过，并取得新的 `/v3/api-docs/admin` 输出。
2. 在前端运行 `npm run openapi:sync`，不要手工编辑生成文件。
3. 审查 `openapi.json` 与 `schema.d.ts` diff，确认只包含预期路径和 schema。
4. 运行 `npm run openapi:check`、`npm run typecheck` 和受影响 service/page 测试。
5. Identifier 必须保持字符串；普通数值保持数字；required 与 nullable 必须匹配后端。
6. 后端和前端分别提交，前端不得反向修改后端契约。
