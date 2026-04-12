import type { MenuTreeNode, MenuView } from '@/types/menu'
import type { PermissionView } from '@/pages/system/permission/types'

export type TreeSelectOption = {
  title: string
  value: string
  key: string
  disabled?: boolean
  selectable?: boolean
  disableCheckbox?: boolean
  children?: TreeSelectOption[]
}

export function hasId(value?: string | null): value is string {
  return value !== undefined && value !== null && value !== ''
}

export function collectRelationIds(
  items?: Array<{ id?: string | null }> | null,
): string[] {
  return (items ?? []).flatMap((item) => (hasId(item.id) ? [item.id] : []))
}

export function getMenuDisplayName(menu?: Partial<MenuView> | null) {
  if (!menu) {
    return '未命名菜单'
  }

  return (
    menu.title ||
    menu.name ||
    menu.key ||
    (hasId(menu.id) ? `#${menu.id}` : '未命名菜单')
  )
}

export function getPermissionDisplayName(
  permission?: Partial<PermissionView> | null,
) {
  if (!permission) {
    return '未命名权限'
  }

  return (
    permission.name ||
    permission.code ||
    (hasId(permission.id) ? `#${permission.id}` : '未命名权限')
  )
}

export function buildMenuTreeSelectData(
  nodes: MenuTreeNode[],
  options?: { includeButtons?: boolean },
): TreeSelectOption[] {
  const includeButtons = options?.includeButtons ?? false

  return nodes
    .filter((node) => includeButtons || node.type !== 'button')
    .flatMap((node) => {
      if (!hasId(node.id)) {
        return []
      }

      return [
        {
          title: getMenuDisplayName(node),
          value: node.id,
          key: node.id,
          disabled: node.disabled === true,
          children: buildMenuTreeSelectData(node.children ?? [], {
            includeButtons,
          }),
        },
      ]
    })
}

export function buildPermissionTreeData(
  permissions: PermissionView[],
): TreeSelectOption[] {
  const groupMap = new Map<string, TreeSelectOption>()

  permissions.forEach((permission) => {
    if (!hasId(permission.id)) {
      return
    }
    const permissionId = permission.id

    const menu = permission.menu
    const menuId = hasId(menu?.id) ? menu.id : `menu-${permissionId}`

    if (!groupMap.has(menuId)) {
      groupMap.set(menuId, {
        title: menuId.startsWith('menu-')
          ? '未绑定菜单'
          : `${getMenuDisplayName(menu)}${menu?.path ? ` (${menu.path})` : ''}`,
        value: `group:${menuId}`,
        key: `group:${menuId}`,
        selectable: false,
        disableCheckbox: true,
        children: [],
      })
    }

    groupMap.get(menuId)?.children?.push({
      title: `${getPermissionDisplayName(permission)}${permission.code ? ` [${permission.code}]` : ''}`,
      value: permissionId,
      key: permissionId,
      disabled: permission.enabled === false,
    })
  })

  return Array.from(groupMap.values()).filter((group) => group.children?.length)
}
