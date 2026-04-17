import type {
  MenuTreeNode,
  MenuType,
  MenuUpsertInput,
  MenuView,
} from '@/types/menu'
import type {
  PermissionView,
  SavePermissionInput,
  UpdatePermissionInput,
} from '@/pages/iam/permission/types'
import type {
  RoleView,
  SaveRoleInput,
  UpdateRoleInput,
} from '@/pages/iam/role/types'
import type {
  SaveUserInput,
  UpdateUserInput,
  UserView,
} from '@/pages/iam/user/types'

type BackendId = number | string
type BackendMenuType = 'DIRECTORY' | 'MENU' | 'BUTTON' | 'LINK'

export interface IamUserResponse {
  id: BackendId
  username: string
  phone?: string | null
  email?: string | null
  avatar?: string | null
  enabled: boolean
  roleIds?: BackendId[] | null
  createdAt?: string
  updatedAt?: string
  version?: number
}

export interface IamRoleResponse {
  id: BackendId
  code: string
  name: string
  enabled: boolean
  menuIds?: BackendId[] | null
  permissionIds?: BackendId[] | null
  createdAt?: string
  updatedAt?: string
  version?: number
}

export interface IamPermissionResponse {
  id: BackendId
  menuId: BackendId
  code: string
  name: string
  enabled: boolean
  sortingOrder: number
  createdAt?: string
  updatedAt?: string
  version?: number
}

export interface IamMenuTreeNodeResponse {
  id: BackendId
  parentId?: BackendId | null
  disabled?: boolean
  extra?: string | null
  icon?: string | null
  key: string
  title: string
  visible?: boolean
  path?: string | null
  routeName?: string | null
  redirect?: string | null
  component?: string | null
  sortingOrder?: number
  pinned?: boolean
  showTab?: boolean
  enableMultiTab?: boolean
  type?: BackendMenuType | MenuType | null
  hidden?: boolean
  hideChildrenInMenu?: boolean
  flatMenu?: boolean
  activeMenu?: string | null
  external?: boolean
  target?: string | null
  children?: IamMenuTreeNodeResponse[] | null
}

export interface IamMenuResponse extends IamMenuTreeNodeResponse {
  createdAt?: string
  updatedAt?: string
  version?: number
}

export interface IamCurrentUserResponse {
  sessionId: string
  user: IamUserResponse
  roles: IamRoleResponse[]
  permissions: IamPermissionResponse[]
  roleCodes: string[]
  permissionCodes: string[]
  menuTree: IamMenuTreeNodeResponse[]
}

export function normalizeUser(user: IamUserResponse): UserView {
  return {
    id: toId(user.id),
    username: user.username,
    phone: user.phone ?? null,
    email: user.email ?? null,
    avatar: user.avatar ?? null,
    enabled: user.enabled,
    roleIds: toIds(user.roleIds),
  }
}

export function normalizeRole(role: IamRoleResponse): RoleView {
  return {
    id: toId(role.id),
    code: role.code,
    name: role.name,
    enabled: role.enabled,
    menuIds: toIds(role.menuIds),
    permissionIds: toIds(role.permissionIds),
  }
}

export function normalizePermission(
  permission: IamPermissionResponse,
): PermissionView {
  return {
    id: toId(permission.id),
    menuId: toId(permission.menuId),
    code: permission.code,
    name: permission.name,
    enabled: permission.enabled,
    sortingOrder: permission.sortingOrder,
  }
}

export function normalizeMenu(menu: IamMenuTreeNodeResponse): MenuView {
  return {
    id: toId(menu.id),
    parentId: toOptionalId(menu.parentId),
    key: menu.key,
    title: menu.title,
    icon: menu.icon ?? undefined,
    path: menu.path ?? undefined,
    name: menu.routeName ?? undefined,
    component: menu.component ?? undefined,
    redirect: menu.redirect ?? undefined,
    sortingOrder: menu.sortingOrder ?? 0,
    disabled: menu.disabled ?? false,
    show: menu.visible ?? true,
    pinned: menu.pinned ?? false,
    showTab: menu.showTab ?? true,
    enableMultiTab: menu.enableMultiTab ?? false,
    type: normalizeMenuType(menu.type),
    hidden: menu.hidden ?? false,
    hideChildrenInMenu: menu.hideChildrenInMenu ?? false,
    flatMenu: menu.flatMenu ?? false,
    activeMenu: menu.activeMenu ?? null,
    external: menu.external ?? false,
    target: menu.target ?? null,
    extra: menu.extra ?? null,
  }
}

export function normalizeMenuTree(
  nodes: IamMenuTreeNodeResponse[],
): MenuTreeNode[] {
  return nodes.map((node) => ({
    ...normalizeMenu(node),
    children: normalizeMenuTree(node.children ?? []),
  }))
}

export function toBackendUserPayload(payload: SaveUserInput | UpdateUserInput) {
  return {
    username: payload.username,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    avatar: payload.avatar ?? null,
    enabled: payload.enabled ?? true,
    passwordHash: payload.passwordHash ?? null,
    roleIds: toBackendIds(payload.roleIds),
  }
}

export function toBackendRolePayload(payload: SaveRoleInput | UpdateRoleInput) {
  return {
    code: payload.code,
    name: payload.name,
    enabled: payload.enabled ?? true,
    menuIds: toBackendIds(payload.menuIds),
    permissionIds: toBackendIds(payload.permissionIds),
  }
}

export function toBackendPermissionPayload(
  payload: SavePermissionInput | UpdatePermissionInput,
) {
  return {
    menuId: toBackendId(payload.menuId),
    code: payload.code,
    name: payload.name,
    enabled: payload.enabled ?? true,
    sortingOrder: payload.sortingOrder ?? 0,
  }
}

export function toBackendMenuPayload(payload: MenuUpsertInput) {
  return {
    parentId: toOptionalBackendId(payload.parentId),
    disabled: payload.disabled,
    extra: payload.extra ?? null,
    icon: payload.icon ?? null,
    key: payload.key,
    title: payload.title,
    visible: payload.show,
    path: payload.path ?? null,
    routeName: payload.name,
    redirect: payload.redirect ?? null,
    component: payload.component ?? null,
    sortingOrder: payload.sortingOrder,
    pinned: payload.pinned,
    showTab: payload.showTab,
    enableMultiTab: payload.enableMultiTab,
    type: toBackendMenuType(payload.type),
    hidden: payload.hidden,
    hideChildrenInMenu: payload.hideChildrenInMenu,
    flatMenu: payload.flatMenu,
    activeMenu: payload.activeMenu ?? null,
    external: payload.external,
    target: payload.target ?? null,
  }
}

export function flattenMenuTree(nodes: MenuTreeNode[]): MenuView[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenMenuTree(node.children ?? []),
  ])
}

export function normalizeMenuType(value?: BackendMenuType | MenuType | null) {
  const normalized = String(value ?? 'menu').toLowerCase()
  if (
    normalized === 'directory' ||
    normalized === 'menu' ||
    normalized === 'button' ||
    normalized === 'link'
  ) {
    return normalized
  }

  return 'menu'
}

function toBackendMenuType(value?: MenuType | null): BackendMenuType {
  return normalizeMenuType(value).toUpperCase() as BackendMenuType
}

function toId(value: BackendId) {
  return String(value)
}

function toOptionalId(value?: BackendId | null) {
  return value === undefined || value === null ? null : toId(value)
}

function toIds(values?: BackendId[] | null) {
  return (values ?? []).map(toId)
}

function toBackendId(value?: string | null) {
  const normalized = value?.trim()
  if (!normalized) {
    return null
  }

  return normalized
}

function toOptionalBackendId(value?: string | null) {
  return toBackendId(value)
}

function toBackendIds(values?: string[] | null) {
  return (values ?? [])
    .map(toBackendId)
    .filter((value): value is string => value !== null)
}
