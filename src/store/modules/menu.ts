import { defineStore } from 'pinia'
import { routes } from 'vue-router/auto-routes'
import type { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menuTree = ref<MenuRecord[]>([])
    const isMenuTreeNotInitialized = ref(true)

    function getMenuTree() {
      if (isMenuTreeNotInitialized.value) {
        menuTree.value = convertRoutesToMenus(routes)
        isMenuTreeNotInitialized.value = false
      }
      return menuTree.value
    }

    /**
     *
     * 只有为顶层节点并且meta中的layout为main的才需要渲染成菜单
     * 满足以上条件的路由，其子路由也需要渲染成菜单，这样的节点复制成菜单
     * @param originalRoutes 原始路由数组
     * @returns 菜单数组
     */
    function convertRoutesToMenus(originalRoutes: RouteRecordRaw[]): MenuRecord[] {
      // 递归处理子路由，过滤没有title或showInMenu为false的菜单，并将有title的子路由上移
      function mapRouteToMenu(route: RouteRecordRaw, parentFullPath = ''): MenuRecord[] {
        const title =
          typeof route.meta?.title === 'string' ? route.meta.title : route.name?.toString() || ''
        const showInMenu =
          typeof route.meta?.showInMenu === 'boolean' ? route.meta.showInMenu : true
        const hasTitleAndShow = !!title && showInMenu
        // 计算 fullPath，合并父级 fullPath 和当前 path
        let fullPath = ''
        if (parentFullPath) {
          if (route.path.startsWith('/')) {
            fullPath = route.path
          } else {
            fullPath = parentFullPath.endsWith('/')
              ? parentFullPath + route.path
              : parentFullPath + '/' + route.path
          }
        } else {
          fullPath = route.path
        }
        // 结尾是/且不是根路径时去除/
        if (fullPath.length > 1 && fullPath.endsWith('/')) {
          fullPath = fullPath.slice(0, -1)
        }
        const children =
          route.children?.filter((child) =>
            typeof child.meta?.showInMenu === 'boolean' ? child.meta.showInMenu : true,
          ) || []
        const mappedChildren = children.flatMap((child) => mapRouteToMenu(child, fullPath))

        if (hasTitleAndShow) {
          const menu: MenuRecord = {
            title,
            name: route.name?.toString() || '',
            path: route.path,
            fullPath,
            showInMenu,
            icon: typeof route.meta?.icon === 'string' ? route.meta.icon : undefined,
          }
          if (mappedChildren.length > 0) {
            menu.children = mappedChildren
          }
          return [menu]
        } else {
          // 没有title或showInMenu为false，直接返回有title且showInMenu为true的子菜单（上移）
          return mappedChildren
        }
      }

      // 只处理顶层且meta.layout为main的路由
      return originalRoutes
        .filter(
          (route) =>
            (typeof route.meta?.showInMenu === 'boolean' ? route.meta.showInMenu : true) &&
            route.meta?.layout === 'main',
        )
        .flatMap((route) => mapRouteToMenu(route, route.path))
    }

    return {
      getMenuTree,
    }
  },
  {
    persist: false,
  },
)
