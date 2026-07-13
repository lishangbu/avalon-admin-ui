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

**Player Area**:
已认证账户选择 Trainer 后参与真人对局的 `/play` 路由边界；它不属于管理端 Admin Resource，也不依赖管理角色或管理菜单。
_Avoid_: Admin Page, Management Resource, Battle Session Admin

**Battle Session**:
管理端创建和观察的服务端内存战斗执行过程；活跃会话及尚未被终态缓存淘汰的近期会话可查询，它不是玩家匹配、真人对局或数据库记录。
_Avoid_: Match, Room, Sandbox Replay, Persisted Resource

**Recent Session**:
已经完成或终止、但在 `expiresAt` 之前仍可供管理端确认结果的 Battle Session；它不是永久历史记录。
_Avoid_: Battle Record Archive, Persistent History, Active Session

**Session Identifier**:
由后端生成、在管理端作为不透明字符串使用的 Battle Session UUID；它不适用数据库长整型 Identifier 的契约。
_Avoid_: Numeric ID, CosId, Sequence Number

**Session Roster**:
管理端创建 Battle Session 时提交的双方阵容配置；场内 side 和 actor 标识由后端生成并随创建结果返回。
_Avoid_: Battle State, Client Actor Identity, Sandbox Snapshot

**Turn Command**:
管理端用于让 Battle Session 恰好推进一次的完整回合命令；它包含幂等标识、预期会话版本和全部行动。
_Avoid_: Player Move, Partial Submission, Sandbox Turn Request

**Turn Requirements**:
后端根据 Battle Session 当前权威状态给出的下一回合选择要求；管理端据此收集完整行动，而不自行推导战斗规则。
_Avoid_: UI Validation, Available Moves, Local Battle Rule

**Session Termination**:
管理端主动停止仍在运行的 Battle Session；它不同于引擎自然完成，也不生成虚假的战斗结果。
_Avoid_: Battle Completion, Delete, Failed Turn
