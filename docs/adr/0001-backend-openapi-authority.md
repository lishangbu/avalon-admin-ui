# Consume the backend OpenAPI as the contract authority

Avalon Admin UI 将后端生成的 admin OpenAPI 作为唯一契约权威，并提交 `openapi.json` 与生成的 `schema.d.ts` 作为可独立验证的 Contract Snapshot。前端 service 从生成类型推导且不手写重复 DTO；这允许两个仓库独立提交，但要求每次后端契约变化后显式同步并验证快照。
