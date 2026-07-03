import { useQuery } from '@tanstack/react-query';
import { Button, Card, Form, Input, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { BooleanStatusTag, TextStatusTag } from '../../../../shared/components/StatusTag';
import {
  systemServices,
  type AccessNodeListQuery,
  type AccessNodeResponse,
} from '../../../../services/system';
import { toPageRows, toPageTotal } from '../../shared/page-utils';

interface AccessNodeFilters {
  q: string;
  type?: string;
  visible?: boolean;
  enabled?: boolean;
}

/**
 * 访问节点页面。
 *
 * 访问节点来自后端内置权限模型，是菜单目录、路由页面和 API 权限的统一描述。前端这里只做查询和
 * 详情展示，不提供编辑入口，避免误导管理员认为权限节点可以在 UI 中随意变更。
 */
export function AccessNodesPage() {
  const [filters, setFilters] = useState<AccessNodeFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailNode, setDetailNode] = useState<AccessNodeResponse | null>(null);

  const query = useMemo<AccessNodeListQuery>(
    () => ({
      q: filters.q || undefined,
      type: filters.type,
      visible: filters.visible,
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
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (type: string) => <TextStatusTag value={type} />,
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 220,
      render: (value?: string) => value || '-',
    },
    {
      title: '可见',
      dataIndex: 'visible',
      width: 100,
      render: (value: boolean) => (
        <BooleanStatusTag value={value} trueText="可见" falseText="隐藏" />
      ),
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
          <Typography.Text type="secondary">
            查看后端权限节点、菜单路由和 API 访问规则。
          </Typography.Text>
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
          <Form.Item label="节点类型" className="!mb-0">
            <Select
              allowClear
              aria-label="节点类型"
              placeholder="全部类型"
              style={{ width: 150 }}
              options={[
                { label: 'DIRECTORY', value: 'DIRECTORY' },
                { label: 'ROUTE', value: 'ROUTE' },
                { label: 'API', value: 'API' },
              ]}
              onChange={(type) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, type }));
              }}
            />
          </Form.Item>
          <Form.Item label="可见状态" className="!mb-0">
            <Select
              allowClear
              aria-label="可见状态"
              placeholder="全部"
              style={{ width: 140 }}
              options={[
                { label: '可见', value: true },
                { label: '隐藏', value: false },
              ]}
              onChange={(visible) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, visible }));
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
          scroll={{ x: 1240 }}
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
              key: 'type',
              label: '类型',
              children: detailNode ? <TextStatusTag value={detailNode.type} /> : '-',
            },
            { key: 'parentId', label: '父节点 ID', children: detailNode?.parentId ?? '-' },
            { key: 'path', label: '路径', children: detailNode?.path ?? '-' },
            { key: 'icon', label: '图标', children: detailNode?.icon ?? '-' },
            { key: 'sortOrder', label: '排序', children: detailNode?.sortOrder ?? '-' },
            {
              key: 'visible',
              label: '可见',
              children: detailNode ? (
                <BooleanStatusTag value={detailNode.visible} trueText="可见" falseText="隐藏" />
              ) : (
                '-'
              ),
            },
            {
              key: 'enabled',
              label: '启用',
              children: detailNode ? (
                <BooleanStatusTag value={detailNode.enabled} trueText="启用" falseText="禁用" />
              ) : (
                '-'
              ),
            },
            { key: 'apiMethod', label: 'API 方法', children: detailNode?.apiMethod ?? '-' },
            { key: 'apiPattern', label: 'API 路径模式', children: detailNode?.apiPattern ?? '-' },
          ]}
          extra={
            detailNode ? (
              <Space>
                <Typography.Text type="secondary">ID: {detailNode.id}</Typography.Text>
              </Space>
            ) : null
          }
        />
      </Card>
    </div>
  );
}
