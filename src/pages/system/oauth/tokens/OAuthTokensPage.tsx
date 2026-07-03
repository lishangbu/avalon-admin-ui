import { StopOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import {
  systemServices,
  type OAuthTokenListQuery,
  type OAuthTokenResponse,
} from '../../../../services/system';
import { formatDateTime, toPageRows, toPageTotal } from '../../shared/page-utils';
import { message } from '../../../../shared/feedback/message';

interface OAuthTokenFilters {
  q: string;
  clientId: string;
  principalName: string;
}

const TOKEN_STATUS_TEXT: Record<string, string> = {
  ACTIVE: '有效',
  EXPIRED: '已过期',
  REVOKED: '已撤销',
  NO_ACCESS_TOKEN: '无访问令牌',
};

const TOKEN_STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  EXPIRED: 'orange',
  REVOKED: 'red',
  NO_ACCESS_TOKEN: 'default',
};

/**
 * OAuth 令牌管理页。
 *
 * 后端只返回授权和令牌生命周期元数据，不返回 token 明文。页面支持查询、详情查看和撤销，
 * 撤销后会刷新列表并以后端最新状态为准。
 */
export function OAuthTokensPage() {
  const [filters, setFilters] = useState<OAuthTokenFilters>({
    q: '',
    clientId: '',
    principalName: '',
  });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailToken, setDetailToken] = useState<OAuthTokenResponse | null>(null);
  const queryClient = useQueryClient();

  const query = useMemo<OAuthTokenListQuery>(
    () => ({
      q: filters.q || undefined,
      clientId: filters.clientId || undefined,
      principalName: filters.principalName || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const tokensQuery = useQuery({
    queryKey: ['system', 'oauth-tokens', query],
    queryFn: () => systemServices.oauthTokens.list(query),
  });

  const revokeMutation = useMutation({
    mutationFn: (token: OAuthTokenResponse) => systemServices.oauthTokens.revoke(token.id),
    onSuccess: async (token) => {
      message.success('令牌已撤销');
      setDetailToken((current) => (current?.id === token.id ? token : current));
      await queryClient.invalidateQueries({ queryKey: ['system', 'oauth-tokens'] });
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '撤销失败'),
  });

  const columns: ColumnsType<OAuthTokenResponse> = [
    {
      title: '授权主体',
      dataIndex: 'principalName',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      width: 220,
    },
    {
      title: '客户端名称',
      dataIndex: 'clientName',
      width: 200,
      render: (value?: string) => value || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: renderStatus,
    },
    {
      title: '授权类型',
      dataIndex: 'authorizationGrantType',
      width: 260,
    },
    {
      title: 'Scopes',
      dataIndex: 'accessTokenScopes',
      render: renderScopes,
    },
    {
      title: '签发时间',
      dataIndex: 'accessTokenIssuedAt',
      width: 180,
      render: formatDateTime,
    },
    {
      title: '过期时间',
      dataIndex: 'accessTokenExpiresAt',
      width: 180,
      render: formatDateTime,
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => setDetailToken(record)}>
            详情
          </Button>
          <Popconfirm
            title="撤销令牌"
            description={`确认撤销 ${record.principalName} 的访问令牌？`}
            okText="撤销"
            cancelText="取消"
            okType="danger"
            disabled={!record.active}
            onConfirm={() => revokeMutation.mutate(record)}
          >
            <Button
              type="link"
              size="small"
              danger
              disabled={!record.active}
              icon={<StopOutlined />}
            >
              撤销
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            令牌管理
          </Typography.Title>
          <Typography.Text type="secondary">
            查看授权服务器已签发的令牌元数据并撤销活跃令牌。
          </Typography.Text>
        </div>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="授权 ID、用户或 Client ID"
              onSearch={(value) => updateFilter({ q: value.trim() })}
            />
          </Form.Item>
          <Form.Item label="Client ID" className="!mb-0">
            <Input
              allowClear
              placeholder="system-admin-opaque"
              style={{ width: 220 }}
              onChange={(event) => updateFilter({ clientId: event.target.value.trim() })}
            />
          </Form.Item>
          <Form.Item label="授权主体" className="!mb-0">
            <Input
              allowClear
              placeholder="admin"
              style={{ width: 180 }}
              onChange={(event) => updateFilter({ principalName: event.target.value.trim() })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<OAuthTokenResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(tokensQuery.data)}
          loading={tokensQuery.isLoading || tokensQuery.isFetching}
          scroll={{ x: 1580 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(tokensQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
        <EntityDrawer
          open={Boolean(detailToken)}
          title="令牌详情"
          onClose={() => setDetailToken(null)}
          items={[
            { key: 'id', label: '授权 ID', children: detailToken?.id ?? '-' },
            {
              key: 'registeredClientId',
              label: '注册客户端 ID',
              children: detailToken?.registeredClientId ?? '-',
            },
            { key: 'clientId', label: 'Client ID', children: detailToken?.clientId ?? '-' },
            { key: 'clientName', label: '客户端名称', children: detailToken?.clientName ?? '-' },
            {
              key: 'principalName',
              label: '授权主体',
              children: detailToken?.principalName ?? '-',
            },
            {
              key: 'authorizationGrantType',
              label: '授权类型',
              children: detailToken?.authorizationGrantType ?? '-',
            },
            {
              key: 'status',
              label: '状态',
              children: detailToken ? renderStatus(detailToken.status) : '-',
            },
            {
              key: 'authorizedScopes',
              label: '授权 Scopes',
              children: renderScopes(detailToken?.authorizedScopes),
            },
            {
              key: 'accessTokenScopes',
              label: '访问令牌 Scopes',
              children: renderScopes(detailToken?.accessTokenScopes),
            },
            {
              key: 'accessTokenType',
              label: '令牌类型',
              children: detailToken?.accessTokenType ?? '-',
            },
            {
              key: 'accessTokenIssuedAt',
              label: 'Access Token 签发时间',
              children: formatDateTime(detailToken?.accessTokenIssuedAt),
            },
            {
              key: 'accessTokenExpiresAt',
              label: 'Access Token 过期时间',
              children: formatDateTime(detailToken?.accessTokenExpiresAt),
            },
            {
              key: 'refreshTokenIssuedAt',
              label: 'Refresh Token 签发时间',
              children: formatDateTime(detailToken?.refreshTokenIssuedAt),
            },
            {
              key: 'refreshTokenExpiresAt',
              label: 'Refresh Token 过期时间',
              children: formatDateTime(detailToken?.refreshTokenExpiresAt),
            },
          ]}
          extra={
            detailToken?.active ? (
              <Popconfirm
                title="撤销令牌"
                description={`确认撤销 ${detailToken.principalName} 的访问令牌？`}
                okText="撤销"
                cancelText="取消"
                okType="danger"
                onConfirm={() => revokeMutation.mutate(detailToken)}
              >
                <Button danger icon={<StopOutlined />} loading={revokeMutation.isPending}>
                  撤销
                </Button>
              </Popconfirm>
            ) : null
          }
        />
      </Card>
    </div>
  );

  function updateFilter(next: Partial<OAuthTokenFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }
}

function renderStatus(status?: string) {
  const value = status ?? 'NO_ACCESS_TOKEN';
  return <Tag color={TOKEN_STATUS_COLOR[value] ?? 'blue'}>{TOKEN_STATUS_TEXT[value] ?? value}</Tag>;
}

function renderScopes(scopes?: string[]) {
  if (!scopes?.length) {
    return '-';
  }
  return (
    <Space size={[4, 4]} wrap>
      {scopes.map((scope) => (
        <Tag key={scope}>{scope}</Tag>
      ))}
    </Space>
  );
}
