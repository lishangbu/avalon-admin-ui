# Avalon Admin UI

定义 Avalon 管理端围绕后端契约和资料管理使用的稳定领域语言。

## Language

**Admin Resource**:
由后端管理、并在管理端中提供发现和维护能力的一组领域记录。
_Avoid_: Page, Table, Endpoint

**Resource Slice**:
一个 Admin Resource 在管理端中的完整能力边界，包括发现、查看、维护和权限体验。
_Avoid_: CRUD Page, Menu Item

**Contract Snapshot**:
管理端消费的后端管理 API 权威描述；前端类型和请求必须与它保持一致。
_Avoid_: Handwritten DTO, Local API Shape

**Identifier**:
在管理端边界中作为不透明字符串处理的记录身份，不参与数值运算。
_Avoid_: Numeric ID, Sequence Number
