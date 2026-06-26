import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { fallbackMenuNodes, resolveNodePath, toMenuItems } from './menu';

const { Header, Content, Sider } = Layout;

/**
 * 管理端主布局。
 *
 * 菜单优先使用后端 `/api/session` 返回值；如果后端尚未返回菜单，使用前端兜底菜单保证开发期可进入页面。
 */
export function AppLayout() {
  const auth = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const menuNodes = auth.session?.menus?.length ? auth.session.menus : fallbackMenuNodes;
  const menuItems = useMemo(() => toMenuItems(menuNodes), [menuNodes]);
  const openKeys = useMemo(
    () =>
      menuNodes
        .filter((node) =>
          node.children?.some((child) => resolveNodePath(child) === location.pathname),
        )
        .map((node) => resolveNodePath(node) ?? node.code),
    [location.pathname, menuNodes],
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        width={232}
        theme="light"
        collapsed={collapsed}
        className="border-r border-slate-200"
        breakpoint="lg"
      >
        <div className="flex h-14 items-center px-4 text-base font-semibold text-slate-900">
          Avalon Admin
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
              aria-label="切换侧边栏"
            />
            <Typography.Text strong>管理控制台</Typography.Text>
          </Space>
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
        <Content className="p-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
