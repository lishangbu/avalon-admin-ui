import { Card, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface GameDataPageShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}

/**
 * 游戏资料页面通用外壳。
 *
 * 资料管理页以批量浏览和快速编辑为主，沿用后台高密度布局，但保持在 game-data 目录内独立维护。
 */
export function GameDataPageShell({
  title,
  description,
  actions,
  filters,
  children,
}: GameDataPageShellProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            {title}
          </Typography.Title>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </div>
        {actions ? <Space wrap>{actions}</Space> : null}
      </div>
      {filters ? (
        <Card size="small">
          <div className="flex flex-wrap items-end gap-3">{filters}</div>
        </Card>
      ) : null}
      <Card size="small">{children}</Card>
    </div>
  );
}
