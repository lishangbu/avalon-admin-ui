import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { SettingDrawer } from '@ant-design/pro-components/es/layout';
import { Button, Dropdown, Layout, Menu, Space, Spin, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
  findActiveRootKey,
  findOpenKeys,
  resolveNodePath,
  toMenuItems,
  toRootMenuItems,
} from './menu';
import { defaultLayoutSettings, useLayoutSettings } from '../settings/LayoutSettingsProvider';

const { Header, Content, Footer, Sider } = Layout;

/**
 * 管理端主布局。
 *
 * 菜单只使用后端 `/api/session` 返回值，权限裁剪和可见性由服务端统一决定。
 */
export function AppLayout() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { settings, updateSettings } = useLayoutSettings();
  const [collapsed, setCollapsed] = useState(false);
  const menuNodes = auth.session?.menus ?? [];

  const layoutMode = settings.layout ?? 'side';
  const isTopLayout = layoutMode === 'top';
  const isMixLayout = layoutMode === 'mix';
  const isSplitMixMenu = isMixLayout && settings.splitMenus;
  const menuVisible = settings.menuRender !== false;
  const headerVisible = settings.headerRender !== false;
  const footerVisible = settings.footerRender !== false;
  const menuHeaderVisible = settings.menuHeaderRender !== false;
  const menuTheme = settings.navTheme === 'realDark' ? 'dark' : 'light';
  const activeRootKey = useMemo(
    () => findActiveRootKey(menuNodes, location.pathname),
    [location.pathname, menuNodes],
  );
  const sideMenuNodes = useMemo(() => {
    if (!isSplitMixMenu) {
      return menuNodes;
    }
    return menuNodes.find((node) => node.code === activeRootKey)?.children ?? [];
  }, [activeRootKey, isSplitMixMenu, menuNodes]);
  const sideMenuItems = useMemo(
    () => toMenuItems(sideMenuNodes, { groupDirectories: settings.siderMenuType === 'group' }),
    [settings.siderMenuType, sideMenuNodes],
  );
  const topMenuItems = useMemo(
    () => (isSplitMixMenu ? toRootMenuItems(menuNodes) : toMenuItems(menuNodes)),
    [isSplitMixMenu, menuNodes],
  );
  const routeOpenKeys = useMemo(
    () => findOpenKeys(sideMenuNodes, location.pathname),
    [location.pathname, sideMenuNodes],
  );
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const shouldShowSider =
    menuVisible &&
    !isTopLayout &&
    (!settings.suppressSiderWhenMenuEmpty || Boolean(sideMenuItems?.length));
  const shouldShowTopMenu = menuVisible && (isTopLayout || isMixLayout);
  const shouldShowSiderBrand =
    menuHeaderVisible && shouldShowSider && (!isMixLayout || !headerVisible);
  const shouldShowHeaderBrand =
    menuHeaderVisible && headerVisible && (isTopLayout || isMixLayout || !shouldShowSider);
  const contentStyle =
    settings.contentWidth === 'Fixed'
      ? {
          maxWidth: 1200,
          marginInline: 'auto',
          width: '100%',
        }
      : undefined;

  useEffect(() => {
    setOpenKeys(routeOpenKeys);
  }, [routeOpenKeys]);

  const handleMixRootClick: MenuProps['onClick'] = ({ key }) => {
    if (!isSplitMixMenu) {
      return;
    }

    const rootNode = menuNodes.find((node) => node.code === key);
    const path = rootNode ? resolveNodePath(rootNode) : undefined;
    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      <Layout className="min-h-screen" style={{ background: token.colorBgLayout }}>
        {shouldShowSider ? (
          <Sider
            width={232}
            theme={menuTheme}
            collapsed={collapsed}
            breakpoint="lg"
            style={{
              borderInlineEnd:
                menuTheme === 'light' ? `1px solid ${token.colorBorderSecondary}` : undefined,
              ...(settings.fixSiderbar
                ? {
                    alignSelf: 'flex-start',
                    height: '100vh',
                    insetBlockStart: 0,
                    overflow: 'auto',
                    position: 'sticky',
                  }
                : undefined),
            }}
          >
            {shouldShowSiderBrand ? (
              <div
                className="flex h-14 items-center px-4 text-base font-semibold"
                style={{ color: menuTheme === 'dark' ? '#fff' : token.colorText }}
              >
                {collapsed ? 'Avalon' : 'Avalon Admin'}
              </div>
            ) : null}
            <Menu
              mode="inline"
              theme={menuTheme}
              selectedKeys={[location.pathname]}
              openKeys={collapsed ? undefined : openKeys}
              onOpenChange={setOpenKeys}
              items={sideMenuItems}
            />
          </Sider>
        ) : null}
        <Layout style={{ minWidth: 0, background: token.colorBgLayout }}>
          {headerVisible ? (
            <Header
              className="flex items-center justify-between"
              style={{
                height: 56,
                lineHeight: '56px',
                paddingInline: 16,
                background: token.colorBgContainer,
                borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorText,
                insetBlockStart: 0,
                position: settings.fixedHeader ? 'sticky' : undefined,
                zIndex: settings.fixedHeader ? 100 : undefined,
              }}
            >
              <Space className="min-w-0" style={{ flex: shouldShowTopMenu ? '0 0 auto' : 1 }}>
                {shouldShowSider ? (
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed((value) => !value)}
                    aria-label="切换侧边栏"
                  />
                ) : null}
                {shouldShowHeaderBrand ? (
                  <Typography.Text strong>Avalon Admin</Typography.Text>
                ) : null}
                {!shouldShowTopMenu ? <Typography.Text strong>管理控制台</Typography.Text> : null}
              </Space>
              {shouldShowTopMenu ? (
                <Menu
                  mode="horizontal"
                  theme={menuTheme}
                  selectedKeys={
                    isSplitMixMenu && activeRootKey ? [activeRootKey] : [location.pathname]
                  }
                  items={topMenuItems}
                  onClick={handleMixRootClick}
                  style={{
                    background: 'transparent',
                    borderBlockEnd: 'none',
                    flex: 1,
                    minWidth: 0,
                  }}
                />
              ) : null}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: auth.logout,
                    },
                  ],
                }}
              >
                <Button type="text">
                  {auth.session?.user.displayName ?? auth.session?.user.username}
                </Button>
              </Dropdown>
            </Header>
          ) : null}
          <Content className="p-4">
            <div style={contentStyle}>
              <Suspense
                fallback={
                  <div className="flex min-h-80 items-center justify-center">
                    <Spin />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </Content>
          {footerVisible ? (
            <Footer
              style={{
                background: 'transparent',
                color: token.colorTextSecondary,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              Avalon Admin
            </Footer>
          ) : null}
        </Layout>
      </Layout>
      <SettingDrawer
        defaultSettings={defaultLayoutSettings}
        settings={settings}
        enableDarkTheme
        pathname={location.pathname}
        disableUrlParams
        onSettingChange={updateSettings}
        drawerProps={{ destroyOnHidden: false }}
      />
    </>
  );
}
