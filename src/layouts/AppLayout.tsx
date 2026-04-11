import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import {
  ProLayout,
  SettingDrawer,
  type Settings as ProSettings,
} from '@ant-design/pro-components'
import { App, Dropdown, Space, Tabs } from 'antd'
import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { APP_NAME } from '@/config/app'
import { useAuthStore } from '@/store/auth'
import { useMenuStore } from '@/store/menu'
import { usePreferencesStore } from '@/store/preferences'
import { useTabsStore } from '@/store/tabs'
import type { AppRouteItem } from '@/types/menu'
import { findMatchedRoute, resolveIcon } from '@/utils/menu'

type ProLayoutRoute = {
  path: string
  name: string
  icon?: ReactNode
  hideInMenu?: boolean
  flatMenu?: boolean
  hideChildrenInMenu?: boolean
  external?: boolean
  target?: string | null
  routes?: ProLayoutRoute[]
}

function toProLayoutRoutes(routes: AppRouteItem[]): ProLayoutRoute[] {
  return routes
    .filter((route) => route.meta.type !== 'button')
    .map((route) => ({
      path: route.path,
      name: route.meta.title,
      icon: resolveIcon(route.meta.icon),
      hideInMenu: route.meta.hidden === true,
      flatMenu: route.meta.flatMenu === true,
      hideChildrenInMenu: route.meta.hideChildrenInMenu === true,
      external: route.meta.external === true,
      target: route.meta.target ?? null,
      routes: route.children ? toProLayoutRoutes(route.children) : undefined,
    }))
}

export function AppLayout() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const routes = useMenuStore((state) => state.routes)
  const {
    themeMode,
    layoutMode,
    colorPrimary,
    contentWidth,
    fixedHeader,
    fixSiderbar,
    splitMenus,
    siderMenuType,
    collapsed,
    toggleCollapsed,
    applySettingDrawer,
  } = usePreferencesStore(
    useShallow((state) => ({
      themeMode: state.themeMode,
      layoutMode: state.layoutMode,
      colorPrimary: state.colorPrimary,
      contentWidth: state.contentWidth,
      fixedHeader: state.fixedHeader,
      fixSiderbar: state.fixSiderbar,
      splitMenus: state.splitMenus,
      siderMenuType: state.siderMenuType,
      collapsed: state.collapsed,
      toggleCollapsed: state.toggleCollapsed,
      applySettingDrawer: state.applySettingDrawer,
    })),
  )
  const { tabs, activeKey, remove, setActive, sync } = useTabsStore()

  const currentRoute = useMemo(
    () => findMatchedRoute(routes, location.pathname),
    [location.pathname, routes],
  )
  const selectedKey = currentRoute?.meta.activeMenu || location.pathname
  const proRoutes = useMemo(() => toProLayoutRoutes(routes), [routes])
  const drawerSettings = useMemo<
    Partial<ProSettings> & { colorPrimary: string }
  >(
    () => ({
      layout: layoutMode,
      navTheme: themeMode === 'dark' ? 'realDark' : 'light',
      colorPrimary,
      contentWidth,
      fixedHeader,
      fixSiderbar,
      splitMenus,
      siderMenuType,
      title: APP_NAME,
    }),
    [
      colorPrimary,
      contentWidth,
      fixSiderbar,
      fixedHeader,
      layoutMode,
      siderMenuType,
      splitMenus,
      themeMode,
    ],
  )

  useEffect(() => {
    if (currentRoute) {
      sync(location.pathname, currentRoute.meta)
    }
  }, [currentRoute, location.pathname, sync])

  return (
    <ProLayout
      title={APP_NAME}
      location={{ pathname: location.pathname }}
      layout={layoutMode}
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      fixedHeader={fixedHeader}
      fixSiderbar={fixSiderbar}
      splitMenus={splitMenus}
      contentWidth={contentWidth}
      route={{ routes: proRoutes }}
      menuItemRender={(item, dom) => {
        if (!item.path) {
          return dom
        }

        if (item.external) {
          return (
            <a
              href={item.path}
              target={item.target ?? '_self'}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
            >
              {dom}
            </a>
          )
        }

        return <Link to={item.path}>{dom}</Link>
      }}
      menu={{
        defaultOpenAll: false,
      }}
      siderMenuType={siderMenuType}
      navTheme={themeMode === 'dark' ? 'realDark' : 'light'}
      avatarProps={{
        src: user?.avatar || undefined,
        icon: <UserOutlined />,
        title: user?.username ?? '未登录',
        render: (_, avatarChildren) => (
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: '个人中心', icon: <UserOutlined /> },
                { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
              ],
              onClick: async ({ key }) => {
                if (key === 'profile') {
                  navigate('/account/profile')
                  return
                }

                await signOut()
                message.success('已退出登录')
                navigate('/login')
              },
            }}
          >
            <span>{avatarChildren}</span>
          </Dropdown>
        ),
      }}
      selectedKeys={[selectedKey]}
      pageTitleRender={false}
      headerTitleRender={(logo, title) => (
        <Space>
          {logo}
          {title}
        </Space>
      )}
      contentStyle={{ padding: 16 }}
    >
      <div className="tabs-shell">
        <Tabs
          hideAdd
          type="editable-card"
          activeKey={activeKey}
          items={tabs.map((item) => ({
            key: item.key,
            label: item.title,
            closable: item.closable,
          }))}
          onChange={(key) => {
            setActive(key)
            navigate(key)
          }}
          onEdit={(targetKey, action) => {
            if (action !== 'remove') {
              return
            }

            const fallback = remove(String(targetKey))
            if (fallback) {
              navigate(fallback)
            }
          }}
        />
      </div>
      <Outlet />
      <SettingDrawer
        disableUrlParams
        enableDarkTheme
        hideHintAlert
        hideCopyButton
        pathname={location.pathname}
        settings={drawerSettings}
        onSettingChange={applySettingDrawer}
      />
    </ProLayout>
  )
}
