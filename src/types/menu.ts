export type MenuType = 'directory' | 'menu' | 'button' | 'link'

export interface MenuView {
  id?: string
  parentId?: string | null
  key?: string
  title?: string
  icon?: string
  path?: string
  name?: string
  component?: string
  redirect?: string
  sortingOrder?: number | null
  disabled?: boolean | null
  show?: boolean | null
  pinned?: boolean | null
  showTab?: boolean | null
  enableMultiTab?: boolean | null
  type?: MenuType | null
  hidden?: boolean | null
  hideChildrenInMenu?: boolean | null
  flatMenu?: boolean | null
  activeMenu?: string | null
  external?: boolean | null
  target?: string | null
  extra?: string | null
}

export interface MenuTreeNode extends MenuView {
  children?: MenuTreeNode[] | null
}

export interface MenuUpsertInput {
  id?: string
  parentId?: string | null
  key: string
  title: string
  icon?: string | null
  path?: string | null
  name: string
  component?: string | null
  redirect?: string | null
  sortingOrder: number
  disabled: boolean
  show: boolean
  pinned: boolean
  showTab: boolean
  enableMultiTab: boolean
  type: MenuType
  hidden: boolean
  hideChildrenInMenu: boolean
  flatMenu: boolean
  activeMenu?: string | null
  external: boolean
  target?: string | null
  extra?: string | null
}

export interface AppRouteMeta {
  title: string
  icon?: string
  pinned?: boolean
  showTab?: boolean
  enableMultiTab?: boolean
  type?: MenuType
  hidden?: boolean
  hideChildrenInMenu?: boolean
  flatMenu?: boolean
  activeMenu?: string | null
  external?: boolean
  target?: string | null
}

export interface AppRouteItem {
  key: string
  path: string
  name: string
  component?: string
  redirect?: string
  disabled?: boolean
  children?: AppRouteItem[]
  meta: AppRouteMeta
}
