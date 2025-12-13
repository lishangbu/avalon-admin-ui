/**
 * 菜单项类型定义
 *
 * @property id 菜单唯一标识
 * @property parentId 父级菜单ID，根节点为 null
 * @property disabled 是否禁用
 * @property extra 额外信息，类型未知
 * @property icon 菜单图标
 * @property key 菜单唯一 key
 * @property label 菜单显示名称
 * @property show 是否显示菜单
 * @property path 路由路径
 * @property name 路由名称
 * @property redirect 路由重定向，若无则为 null
 * @property component 组件路径
 * @property sortOrder 排序值
 * @property pinned 是否固定在菜单栏
 * @property showTab 是否在标签页中显示
 * @property enableMultiTab 是否支持多标签页
 * @property children 子菜单项，若无则为 null
 */
declare interface MenuItem {
  id: number;
  parentId: number | null;
  disabled: boolean;
  extra: unknown | null;
  icon: string;
  key: string;
  label: string;
  show: boolean;
  path: string;
  name: string;
  redirect: string | null;
  component: string;
  sortOrder: number;
  pinned: boolean;
  showTab: boolean;
  enableMultiTab: boolean;
  children: MenuItem[] | null;
}
