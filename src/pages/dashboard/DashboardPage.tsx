import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useAuth } from '../../app/auth/AuthProvider';
import { flattenMenuNodes, isRoutedMenuNode } from '../../app/layout/menu';

/**
 * 工作台展示登录态和系统概览。
 *
 * 数据直接来自 `/api/session`，因此它反映的是后端已经裁剪后的角色、权限和菜单快照。
 */
export function DashboardPage() {
  const { session } = useAuth();
  const menuNodes = session?.menus ?? [];
  const routedMenus = flattenMenuNodes(menuNodes).filter(isRoutedMenuNode);

  return (
    <div className="space-y-4">
      <div>
        <Typography.Title level={3} className="!mb-1">
          工作台
        </Typography.Title>
        <Typography.Text type="secondary">
          当前用户：{session?.user.displayName ?? session?.user.username}
        </Typography.Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="角色数量" value={session?.roles.length ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="权限数量" value={session?.accessNodeCodes.length ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="菜单数量" value={routedMenus.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="接口状态" value="已连接" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
