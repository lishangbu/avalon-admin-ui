import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { findOpenKeys, toMenuItems } from './menu';

const { Header, Content, Sider } = Layout;

/**
 * 管理端主布局。
 *
 * 菜单只使用后端 `/api/session` 返回值，权限裁剪和可见性由服务端统一决定。
 */
export function AppLayout() {
  const auth = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const menuNodes = auth.session?.menus ?? [];
  const menuItems = useMemo(() => toMenuItems(menuNodes), [menuNodes]);
  const routeOpenKeys = useMemo(
    () => findOpenKeys(menuNodes, location.pathname),
    [location.pathname, menuNodes],
  );
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setOpenKeys(routeOpenKeys);
  }, [routeOpenKeys]);

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
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between border-b border-slate-200"
          style={{
            height: 56,
            lineHeight: '56px',
            paddingInline: 16,
            background: '#fff',
            color: '#1f2329',
          }}
        >
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
