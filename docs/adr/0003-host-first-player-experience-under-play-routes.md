# Host the first player experience under /play routes

首版普通玩家 Web 界面放在现有前端仓库的独立 `/play` 路由区，覆盖 Trainer 选择、唯一 Trainer Team、直接 Challenge、Match 对战和 Match History，但不复用管理端菜单、管理角色判断或 Admin Resource 页面组件。没有管理菜单的账户登录后直接进入 `/play`，管理员保持现有管理首页并获得进入游戏/返回管理端入口；账户无 Trainer 时进入创建引导，有 Active Match 时只能恢复对应 Trainer，否则明确选择一个有效 Trainer，浏览器刷新后重新选择。归档 Trainer 只出现在历史管理视图，Player Area 的可访问性不依赖菜单树，并继续消费同一 REST/WebSocket 契约。
