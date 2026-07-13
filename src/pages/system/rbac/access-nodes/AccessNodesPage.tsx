import { useQuery } from '@tanstack/react-query';
import { Button, Card, Form, Input, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { BooleanStatusTag } from '../../../../shared/components/StatusTag';
import {
  systemServices,
  type AccessNodeListQuery,
  type AccessNodeResponse,
} from '../../../../services/system';
import { toPageRows, toPageTotal } from '../../shared/page-utils';

interface AccessNodeFilters {
  q: string;
  enabled?: boolean;
}

/**
 * 访问节点页面。
 *
 * 权限目录来自后端内置权限模型。前端这里只做查询和详情展示，不提供编辑入口。
 */
export function AccessNodesPage() {
  const [filters, setFilters] = useState<AccessNodeFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailNode, setDetailNode] = useState<AccessNodeResponse | null>(null);

  const query = useMemo<AccessNodeListQuery>(
    () => ({
      q: filters.q || undefined,
      enabled: filters.enabled,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const accessNodesQuery = useQuery({
    queryKey: ['system', 'access-nodes', query],
    queryFn: () => systemServices.accessNodes.list(query),
  });

  const columns: ColumnsType<AccessNodeResponse> = [
    {
      title: '节点编码',
      dataIndex: 'code',
      width: 220,
      render: (code: string) => <Typography.Text code>{code}</Typography.Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 160,
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 100,
      render: (value: boolean) => (
        <BooleanStatusTag value={value} trueText="启用" falseText="禁用" />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => setDetailNode(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            访问节点
          </Typography.Title>
          <Typography.Text type="secondary">查看角色授权使用的稳定权限 code。</Typography.Text>
        </div>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="节点编码或名称"
              onSearch={(value) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, q: value.trim() }));
              }}
            />
          </Form.Item>
          <Form.Item label="启用状态" className="!mb-0">
            <Select
              allowClear
              aria-label="启用状态"
              placeholder="全部"
              style={{ width: 140 }}
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
              onChange={(enabled) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, enabled }));
              }}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<AccessNodeResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(accessNodesQuery.data)}
          loading={accessNodesQuery.isLoading || accessNodesQuery.isFetching}
          scroll={{ x: 720 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(accessNodesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
        <EntityDrawer
          open={Boolean(detailNode)}
          title="访问节点详情"
          onClose={() => setDetailNode(null)}
          items={[
            { key: 'code', label: '节点编码', children: detailNode?.code ?? '-' },
            { key: 'name', label: '名称', children: detailNode?.name ?? '-' },
            {
              key: 'enabled',
              label: '启用',
              children: detailNode ? (
                <BooleanStatusTag value={detailNode.enabled} trueText="启用" falseText="禁用" />
              ) : (
                '-'
              ),
            },
          ]}
          extra={
            detailNode ? (
              <Typography.Text type="secondary">ID: {detailNode.id}</Typography.Text>
            ) : null
          }
        />
      </Card>
    </div>
  );
}
