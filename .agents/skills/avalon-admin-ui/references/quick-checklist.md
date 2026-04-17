# 快速清单

## 适用场景

- 准备开始一个前端需求，但还没动手改代码
- 已经知道大概要改哪里，想先做一次 30 秒自检
- 想快速判断这次工作更像页面、菜单、权限、服务还是排障问题

## 开工前 30 秒自检

1. 这次改动的主归属是不是唯一的 `src/pages/<domain>/<feature>/`？
2. 如果是新页面，文件入口是不是 `index.tsx`？
3. 如果页面要被菜单访问，后端 `component` 是否会对应 `<domain>/<feature>/index`？
4. 这次权限是复用已有 `SYSTEM_PERMISSION_CODES`，还是先在页面内用本地 `permissionCodes`？
5. 列表查询是否应该由 TanStack Query 管，是否已经想清楚 `queryKey`？
6. DTO 是否需要在 `service.ts` 或 shared normalizer 里做转换，而不是堆在页面里？
7. 是否真的需要手写新页面，还是先跑 `scripts/scaffold_crud_page.py` 更合适？

## 如果是新增 CRUD 页面

- 默认先看 `references/examples.md`
- 默认先看 `references/crud-page.md`
- 如果没有更好的现成页面可复用，先跑脚手架
- 生成后优先替换默认字段：`keyword`、`code`、`name`、`enabled`、`remark`
- 确认成功提示、校验文案、查询字段和表格列已经换成真实业务语义

## 如果是菜单或路由问题

- 先看 `references/menu-routing.md`
- 先确认页面文件是 `src/pages/**/index.tsx`
- 先确认后端 `component` 精确匹配 `<domain>/<feature>/index`
- 先确认菜单不是 `button`，也不是 `external`
- 先确认路径拼接后是不是你预期的最终 URL

## 如果是权限问题

- 先看 `references/permissions.md`
- 先确认页面级查询权限和按钮权限是分开的
- 先确认 `enabled: canQuery` 没把查询静默关掉
- 先确认前端权限码命名和后端一致
- 如果用了脚手架默认权限前缀，确认它不是过期占位值

## 如果是接口或数据映射问题

- 先看 `references/architecture.md`
- 先确认这次应该改 `service.ts`，还是 shared normalizer
- 先确认列表返回和详情返回是不是同一形状
- 先确认数字 id 是否需要先转成字符串
- 不要把后端 DTO 清洗逻辑散落在 JSX 里

## 如果页面“差不多对了但就是不工作”

- 直接看 `references/troubleshooting.md`

## 默认收尾

- 至少做一次与改动范围匹配的最小验证
- 在说明里明确本次是否验证了路由、权限、查询或构建
- 如果还有脚手架残留字段或待接后端的占位，明确写出来
