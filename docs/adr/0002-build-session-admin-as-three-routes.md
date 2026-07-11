# Build Battle Session admin as three routes

Battle Session 管理能力由同一个 Resource Slice 下的三个路由组成：`/battle-sessions` 查询活跃与 Recent Session；`/battle-sessions/new` 使用服务端权威创建契约配置 Session Roster；`/battle-sessions/:sessionId` 展示当前状态、revision、Turn Requirements、Turn Record 和 Random Trace，并允许 ACTIVE Session 执行完整回合或终止。创建页只复用现有阵容字段组件，不复用会暴露 randomSeed、客户端 sideId、actorId 和状态 JSON 的沙盒页面。行动控件完全由后端 requirements 生成，网络失败以相同 commandId 重试，409 刷新并重新选择，404 表示会话已淘汰，503 capacity-exhausted 提示当前节点容量已满；终态页面显示 expiresAt 且保持只读。首版不增加 WebSocket 或高频轮询。
