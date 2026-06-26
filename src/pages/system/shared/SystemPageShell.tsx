import { Card, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface SystemPageShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}

/**
 * 系统管理页面通用外壳。
 *
 * Avalon 管理端是高频操作后台，页面应以信息密度和可扫描性为优先。这个组件统一标题区、
 * 筛选区和表格容器，让各资源页只关注字段、查询和操作，不重复布局代码。
 */
export function SystemPageShell({
  title,
  description,
  actions,
  filters,
  children,
}: SystemPageShellProps) {
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
