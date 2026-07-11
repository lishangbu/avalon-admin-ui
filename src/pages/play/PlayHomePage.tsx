import { HistoryOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';
import { useAuth } from '../../app/auth/AuthProvider';

export function PlayHomePage() {
  const { logout, session } = useAuth();
  return (
    <main className="play-shell">
      <Flex justify="space-between" align="center" gap={16} wrap>
        <div>
          <Typography.Title level={2}>Avalon 对战中心</Typography.Title>
          <Typography.Text type="secondary">
            {session?.user.displayName ?? session?.user.username}，选择 Trainer 后开始真人对战。
          </Typography.Text>
        </div>
        <Button onClick={logout}>退出登录</Button>
      </Flex>
      <section className="play-grid" aria-label="玩家功能">
        <Card title="Trainer" extra={<TeamOutlined />}>
          创建或选择 Trainer，并维护唯一的标准单打队伍。
        </Card>
        <Card title="Challenge" extra={<ThunderboltOutlined />}>
          精确查找在线 Trainer，发起或处理私有挑战。
        </Card>
        <Card title="Match History" extra={<HistoryOutlined />}>
          查看当前对局以及按己方视角保存的历史记录。
        </Card>
      </section>
    </main>
  );
}
