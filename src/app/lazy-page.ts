import { lazy, type ComponentType } from 'react';

/**
 * 懒加载命名导出的页面组件。
 *
 * React.lazy 只接受 default export，但项目页面为了同时导出资源配置和组件，普遍使用命名导出。把 named export
 * 到 default component 的转换集中在这里，可以让每个路由表只表达“路径对应哪个页面 chunk”，避免在资料页、
 * 战斗规则页等大量页面路由中重复 module.then 包装代码。
 */
export function lazyPage<TModule extends Record<string, unknown>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return lazy(() => loader().then((module) => ({ default: module[exportName] as ComponentType })));
}
