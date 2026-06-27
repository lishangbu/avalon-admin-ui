import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { TextStatusTag } from '../../../../shared/components/StatusTag';
import {
  systemServices,
  type CreateOAuthClientRequest,
  type OAuthClientResponse,
  type PageQuery,
  type ResetOAuthClientSecretRequest,
  type UpdateOAuthClientRequest,
} from '../../../../services/system';
import { SystemPageShell } from '../../shared/SystemPageShell';
import { toPageRows, toPageTotal } from '../../shared/page-utils';

interface OAuthClientFilters {
  q: string;
}

interface OAuthClientFormValues {
  clientId?: string;
  clientSecret?: string;
  clientName: string;
  scopes?: string[];
  accessTokenFormat: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
}

interface SecretFormValues {
  clientSecret?: string;
}

type ClientModalMode = 'create' | 'edit';

const ACCESS_TOKEN_FORMAT_OPTIONS = [
  { label: 'self-contained', value: 'self-contained' },
  { label: 'reference', value: 'reference' },
];

const DEFAULT_SCOPES = ['security:admin', 'game-data:admin'];

const SCOPE_OPTIONS = [
  { label: 'security:admin', value: 'security:admin' },
  { label: 'game-data:admin', value: 'game-data:admin' },
];

/**
 * OAuth 客户端管理页。
 *
 * clientSecret 是只写字段，后端不会在任何响应中回显。创建和重置 secret 时页面只负责提交，
 * 管理员需要在提交前自行保存 secret；详情抽屉只展示元数据。
 */
export function OAuthClientsPage() {
  const [filters, setFilters] = useState<OAuthClientFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailClient, setDetailClient] = useState<OAuthClientResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ClientModalMode>('create');
  const [editingClient, setEditingClient] = useState<OAuthClientResponse | null>(null);
  const [secretClient, setSecretClient] = useState<OAuthClientResponse | null>(null);
  const [form] = Form.useForm<OAuthClientFormValues>();
  const [secretForm] = Form.useForm<SecretFormValues>();
  const queryClient = useQueryClient();

  const query = useMemo<PageQuery>(
    () => ({
      q: filters.q || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const clientsQuery = useQuery({
    queryKey: ['system', 'oauth-clients', query],
    queryFn: () => systemServices.oauthClients.list(query),
  });

  const invalidateClients = async () => {
    await queryClient.invalidateQueries({ queryKey: ['system', 'oauth-clients'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: OAuthClientFormValues) => {
      if (modalMode === 'create') {
        const payload: CreateOAuthClientRequest = {
          clientId: values.clientId ?? '',
          clientSecret: values.clientSecret,
          clientName: values.clientName,
          scopes: values.scopes ?? DEFAULT_SCOPES,
          accessTokenFormat: values.accessTokenFormat,
        };
        return systemServices.oauthClients.create(payload);
      }

      if (!editingClient) {
        throw new Error('缺少正在编辑的 OAuth client');
      }

      const payload: UpdateOAuthClientRequest = {
        clientName: values.clientName,
        scopes: values.scopes ?? DEFAULT_SCOPES,
        accessTokenFormat: values.accessTokenFormat,
        accessTokenTtlSeconds: values.accessTokenTtlSeconds,
        refreshTokenTtlSeconds: values.refreshTokenTtlSeconds,
      };
      return systemServices.oauthClients.update(editingClient.clientId, payload);
    },
    onSuccess: async () => {
      message.success('OAuth client 已保存');
      closeModal();
      await invalidateClients();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '保存失败'),
  });

  const resetSecretMutation = useMutation({
    mutationFn: ({ client, values }: { client: OAuthClientResponse; values: SecretFormValues }) => {
      const payload: ResetOAuthClientSecretRequest = {
        clientSecret: values.clientSecret,
      };
      return systemServices.oauthClients.resetSecret(client.clientId, payload);
    },
    onSuccess: async () => {
      message.success('client secret 已重置');
      setSecretClient(null);
      secretForm.resetFields();
      await invalidateClients();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '重置失败'),
  });

  const columns: ColumnsType<OAuthClientResponse> = [
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      width: 220,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'clientName',
      width: 220,
    },
    {
      title: 'Token 格式',
      dataIndex: 'accessTokenFormat',
      width: 150,
      render: (value: string) => <TextStatusTag value={value} />,
    },
    {
      title: 'Scopes',
      dataIndex: 'scopes',
      render: (scopes: string[]) => (
        <Space size={[4, 4]} wrap>
          {scopes.map((scope) => (
            <Tag key={scope}>{scope}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Access Token TTL',
      dataIndex: 'accessTokenTtlSeconds',
      width: 160,
      render: (value: number) => `${value}s`,
    },
    {
      title: '操作',
      key: 'actions',
      width: 210,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => setDetailClient(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => setSecretClient(record)}>
            重置 secret
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <SystemPageShell
      title="OAuth 客户端"
      description="管理授权服务器注册客户端。"
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          aria-label="新建客户端"
          onClick={openCreateModal}
        >
          新建客户端
        </Button>
      }
      filters={
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            placeholder="clientId 或名称"
            onSearch={(value) => {
              setPage((prev) => ({ ...prev, current: 1 }));
              setFilters({ q: value.trim() });
            }}
          />
        </Form.Item>
      }
    >
      <Table<OAuthClientResponse>
        rowKey="clientId"
        columns={columns}
        dataSource={toPageRows(clientsQuery.data)}
        loading={clientsQuery.isLoading || clientsQuery.isFetching}
        scroll={{ x: 1220 }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: toPageTotal(clientsQuery.data),
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage({ current, pageSize }),
        }}
      />
      <EntityDrawer
        open={Boolean(detailClient)}
        title="OAuth 客户端详情"
        onClose={() => setDetailClient(null)}
        items={[
          { key: 'clientId', label: 'Client ID', children: detailClient?.clientId ?? '-' },
          { key: 'clientName', label: '名称', children: detailClient?.clientName ?? '-' },
          {
            key: 'clientAuthenticationMethods',
            label: '认证方式',
            children: detailClient?.clientAuthenticationMethods.join(', ') || '-',
          },
          {
            key: 'authorizationGrantTypes',
            label: '授权类型',
            children: detailClient?.authorizationGrantTypes.join(', ') || '-',
          },
          { key: 'scopes', label: 'Scopes', children: detailClient?.scopes.join(', ') || '-' },
          {
            key: 'accessTokenFormat',
            label: 'Token 格式',
            children: detailClient ? <TextStatusTag value={detailClient.accessTokenFormat} /> : '-',
          },
          {
            key: 'accessTokenTtlSeconds',
            label: 'Access Token TTL',
            children: detailClient ? `${detailClient.accessTokenTtlSeconds}s` : '-',
          },
          {
            key: 'refreshTokenTtlSeconds',
            label: 'Refresh Token TTL',
            children: detailClient ? `${detailClient.refreshTokenTtlSeconds}s` : '-',
          },
        ]}
      />
      <Modal
        open={modalOpen}
        title={
          modalMode === 'create'
            ? '新建 OAuth 客户端'
            : `编辑客户端：${editingClient?.clientId ?? ''}`
        }
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form<OAuthClientFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => saveMutation.mutate(values)}
        >
          <Form.Item
            name="clientId"
            label="Client ID"
            rules={[{ required: modalMode === 'create', message: '请输入 Client ID' }]}
          >
            <Input disabled={modalMode === 'edit'} autoComplete="off" />
          </Form.Item>
          {modalMode === 'create' ? (
            <Form.Item name="clientSecret" label="Client Secret">
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          ) : null}
          <Form.Item
            name="clientName"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="scopes" label="Scopes">
            <Select mode="multiple" allowClear options={SCOPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="accessTokenFormat"
            label="Access Token 格式"
            rules={[{ required: true, message: '请选择 token 格式' }]}
          >
            <Select options={ACCESS_TOKEN_FORMAT_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="accessTokenTtlSeconds"
            label="Access Token TTL（秒）"
            rules={[{ required: modalMode === 'edit', message: '请输入 access token TTL' }]}
          >
            <InputNumber min={60} className="w-full" />
          </Form.Item>
          <Form.Item
            name="refreshTokenTtlSeconds"
            label="Refresh Token TTL（秒）"
            rules={[{ required: modalMode === 'edit', message: '请输入 refresh token TTL' }]}
          >
            <InputNumber min={60} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={Boolean(secretClient)}
        title={`重置 secret：${secretClient?.clientId ?? ''}`}
        okText="重置"
        cancelText="取消"
        confirmLoading={resetSecretMutation.isPending}
        destroyOnHidden
        onCancel={() => setSecretClient(null)}
        onOk={() => secretForm.submit()}
      >
        <Form<SecretFormValues>
          form={secretForm}
          layout="vertical"
          onFinish={(values) => {
            if (secretClient) {
              resetSecretMutation.mutate({ client: secretClient, values });
            }
          }}
        >
          <Form.Item name="clientSecret" label="新的 Client Secret">
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </SystemPageShell>
  );

  function openCreateModal() {
    setModalMode('create');
    setEditingClient(null);
    setModalOpen(true);
    form.setFieldsValue({
      scopes: DEFAULT_SCOPES,
      accessTokenFormat: 'self-contained',
      accessTokenTtlSeconds: 3600,
      refreshTokenTtlSeconds: 7200,
    });
  }

  function openEditModal(client: OAuthClientResponse) {
    setModalMode('edit');
    setEditingClient(client);
    setModalOpen(true);
    form.setFieldsValue({
      clientId: client.clientId,
      clientName: client.clientName,
      scopes: client.scopes,
      accessTokenFormat: client.accessTokenFormat,
      accessTokenTtlSeconds: client.accessTokenTtlSeconds,
      refreshTokenTtlSeconds: client.refreshTokenTtlSeconds,
    });
  }

  function closeModal() {
    setModalOpen(false);
    setEditingClient(null);
    setModalMode('create');
    form.resetFields();
  }
}
