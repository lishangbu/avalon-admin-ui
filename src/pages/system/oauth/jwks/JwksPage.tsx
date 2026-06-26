import { ReloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { BooleanStatusTag } from '../../../../shared/components/StatusTag';
import { systemServices, type OAuthJwkResponse, type PageQuery } from '../../../../services/system';
import { SystemPageShell } from '../../shared/SystemPageShell';
import { toPageRows, toPageTotal } from '../../shared/page-utils';

interface JwkFilters {
  q: string;
}

/**
 * JWK 管理页。
 *
 * 管理接口只返回 key 元数据，不返回任何私钥材料。轮换操作会创建并激活新的签名 key，
 * 因此页面使用确认框避免误触。
 */
export function JwksPage() {
  const [filters, setFilters] = useState<JwkFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailJwk, setDetailJwk] = useState<OAuthJwkResponse | null>(null);
  const queryClient = useQueryClient();

  const query = useMemo<PageQuery>(
    () => ({
      q: filters.q || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const jwksQuery = useQuery({
    queryKey: ['system', 'jwks', query],
    queryFn: () => systemServices.jwks.list(query),
  });

  const rotateMutation = useMutation({
    mutationFn: () => systemServices.jwks.rotate(),
    onSuccess: async () => {
      message.success('JWK 已轮换');
      await queryClient.invalidateQueries({ queryKey: ['system', 'jwks'] });
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '轮换失败'),
  });

  const columns: ColumnsType<OAuthJwkResponse> = [
    {
      title: 'Key ID',
      dataIndex: 'keyId',
      width: 320,
    },
    {
      title: '状态',
      dataIndex: 'active',
      width: 120,
      render: (value: boolean) => (
        <BooleanStatusTag value={value} trueText="活跃" falseText="停用" />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => setDetailJwk(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <SystemPageShell
      title="JWK 管理"
      description="查看授权服务器 JWT 签名 key 元数据并执行 key 轮换。"
      actions={
        <Popconfirm
          title="轮换 JWK"
          description="确认创建并激活新的 JWT 签名 key？"
          okText="确认"
          cancelText="取消"
          onConfirm={() => rotateMutation.mutate()}
        >
          <Button icon={<ReloadOutlined />} loading={rotateMutation.isPending}>
            轮换 JWK
          </Button>
        </Popconfirm>
      }
      filters={
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            placeholder="Key ID"
            onSearch={(value) => {
              setPage((prev) => ({ ...prev, current: 1 }));
              setFilters({ q: value.trim() });
            }}
          />
        </Form.Item>
      }
    >
      <Table<OAuthJwkResponse>
        rowKey="keyId"
        columns={columns}
        dataSource={toPageRows(jwksQuery.data)}
        loading={jwksQuery.isLoading || jwksQuery.isFetching}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: toPageTotal(jwksQuery.data),
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage({ current, pageSize }),
        }}
      />
      <EntityDrawer
        open={Boolean(detailJwk)}
        title="JWK 详情"
        onClose={() => setDetailJwk(null)}
        items={[
          { key: 'keyId', label: 'Key ID', children: detailJwk?.keyId ?? '-' },
          {
            key: 'active',
            label: '状态',
            children: detailJwk ? (
              <BooleanStatusTag value={detailJwk.active} trueText="活跃" falseText="停用" />
            ) : (
              '-'
            ),
          },
        ]}
        extra={detailJwk ? <Space>ID: {detailJwk.id}</Space> : null}
      />
    </SystemPageShell>
  );
}
