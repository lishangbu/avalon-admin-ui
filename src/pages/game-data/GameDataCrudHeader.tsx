import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import type { GameDataResourceConfig } from './game-data-resources';

export function GameDataCrudHeader({
  config,
  onCreate,
}: {
  config: GameDataResourceConfig;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <Typography.Title level={3} className="!mb-1">
          {config.title}
        </Typography.Title>
        <Typography.Text type="secondary">{config.description}</Typography.Text>
      </div>
      <Space wrap>
        <Button type="primary" icon={<PlusOutlined />} aria-label="新建资料" onClick={onCreate}>
          新建资料
        </Button>
      </Space>
    </div>
  );
}
