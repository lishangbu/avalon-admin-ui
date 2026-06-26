import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { BooleanStatusTag } from '../../../../shared/components/StatusTag';
import {
  systemServices,
  type CreateUserRequest,
  type RoleResponse,
  type UserListQuery,
  type UserResponse,
} from '../../../../services/system';
import { SystemPageShell } from '../../shared/SystemPageShell';
import { toPageRows, toPageTotal } from '../../shared/page-utils';

interface UserFilters {
  q: string;
  roleCode?: string;
  enabled?: boolean;
  accountNonLocked?: boolean;
}

interface CreateUserFormValues {
  username: string;
  password: string;
  displayName: string;
  roleCodes?: string[];
}

interface ResetPasswordFormValues {
  password: string;
}

interface UpdateRolesFormValues {
  roleCodes?: string[];
}

const DEFAULT_FILTERS: UserFilters = {
  q: '',
};

/**
 * 用户管理页。
 *
 * 页面直接对接后端 RBAC 用户 API：列表、创建、启停、锁定、密码重置和角色绑定都会通过
 * systemServices 发起请求。前端只做交互确认和刷新列表，状态最终以后端响应为准。
 */
export function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserResponse | null>(null);
  const [rolesUser, setRolesUser] = useState<UserResponse | null>(null);
  const [createForm] = Form.useForm<CreateUserFormValues>();
  const [resetPasswordForm] = Form.useForm<ResetPasswordFormValues>();
  const [rolesForm] = Form.useForm<UpdateRolesFormValues>();
  const queryClient = useQueryClient();

  const roleQuery = useQuery({
    queryKey: ['system', 'roles', 'options'],
    queryFn: () => systemServices.roles.list({ page: 0, size: 100 }),
  });

  const query = useMemo<UserListQuery>(
    () => ({
      q: filters.q || undefined,
      roleCode: filters.roleCode,
      enabled: filters.enabled,
      accountNonLocked: filters.accountNonLocked,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const usersQuery = useQuery({
    queryKey: ['system', 'users', query],
    queryFn: () => systemServices.users.list(query),
  });

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['system', 'users'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CreateUserRequest) => systemServices.users.create(values),
    onSuccess: async () => {
      message.success('用户已创建');
      setCreateOpen(false);
      createForm.resetFields();
      await invalidateUsers();
    },
    onError: showMutationError,
  });

  const userActionMutation = useMutation({
    mutationFn: async ({
      user,
      action,
    }: {
      user: UserResponse;
      action: 'enable' | 'disable' | 'lock' | 'unlock';
    }) => {
      const actionMap = {
        enable: systemServices.users.enable,
        disable: systemServices.users.disable,
        lock: systemServices.users.lock,
        unlock: systemServices.users.unlock,
      };
      return actionMap[action](user.id);
    },
    onSuccess: async () => {
      message.success('用户状态已更新');
      await invalidateUsers();
    },
    onError: showMutationError,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ user, values }: { user: UserResponse; values: ResetPasswordFormValues }) =>
      systemServices.users.resetPassword(user.id, { password: values.password }),
    onSuccess: async () => {
      message.success('密码已重置');
      setResetPasswordUser(null);
      resetPasswordForm.resetFields();
      await invalidateUsers();
    },
    onError: showMutationError,
  });

  const updateRolesMutation = useMutation({
    mutationFn: ({ user, values }: { user: UserResponse; values: UpdateRolesFormValues }) =>
      systemServices.users.updateRoles(user.id, { roleCodes: values.roleCodes ?? [] }),
    onSuccess: async () => {
      message.success('角色已更新');
      setRolesUser(null);
      rolesForm.resetFields();
      await invalidateUsers();
    },
    onError: showMutationError,
  });

  const roleOptions = toPageRows(roleQuery.data).map((role: RoleResponse) => ({
    label: `${role.name} (${role.code})`,
    value: role.code,
  }));

  const columns: ColumnsType<UserResponse> = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 160,
      fixed: 'left',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 160,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 120,
      render: (value: boolean) => (
        <BooleanStatusTag value={value} trueText="启用" falseText="禁用" />
      ),
    },
    {
      title: '锁定状态',
      dataIndex: 'accountNonLocked',
      width: 120,
      render: (value: boolean) => (
        <BooleanStatusTag value={value} trueText="未锁定" falseText="已锁定" />
      ),
    },
    {
      title: '角色',
      dataIndex: 'roleCodes',
      render: (roleCodes: string[]) => (
        <Space size={[4, 4]} wrap>
          {roleCodes.map((roleCode) => (
            <Tag key={roleCode}>{roleCode}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 310,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button type="link" size="small" onClick={() => setDetailUser(record)}>
            详情
          </Button>
          <Popconfirm
            title={record.enabled ? '禁用用户' : '启用用户'}
            description={`确认${record.enabled ? '禁用' : '启用'} ${record.username}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() =>
              userActionMutation.mutate({
                user: record,
                action: record.enabled ? 'disable' : 'enable',
              })
            }
          >
            <Button type="link" size="small">
              {record.enabled ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={record.accountNonLocked ? '锁定用户' : '解锁用户'}
            description={`确认${record.accountNonLocked ? '锁定' : '解锁'} ${record.username}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() =>
              userActionMutation.mutate({
                user: record,
                action: record.accountNonLocked ? 'lock' : 'unlock',
              })
            }
          >
            <Button type="link" size="small">
              {record.accountNonLocked ? '锁定' : '解锁'}
            </Button>
          </Popconfirm>
          <Button type="link" size="small" onClick={() => setResetPasswordUser(record)}>
            重置密码
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setRolesUser(record);
              rolesForm.setFieldsValue({ roleCodes: record.roleCodes });
            }}
          >
            更新角色
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <SystemPageShell
      title="用户管理"
      description="管理后台账号、状态、密码和角色绑定。"
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          aria-label="新建用户"
          onClick={() => setCreateOpen(true)}
        >
          新建用户
        </Button>
      }
      filters={
        <>
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="用户名或显示名称"
              onSearch={(value) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, q: value.trim() }));
              }}
            />
          </Form.Item>
          <Form.Item label="角色" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              aria-label="角色"
              placeholder="全部角色"
              options={roleOptions}
              style={{ width: 220 }}
              onChange={(roleCode) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, roleCode }));
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
          <Form.Item label="锁定状态" className="!mb-0">
            <Select
              allowClear
              aria-label="锁定状态"
              placeholder="全部"
              style={{ width: 140 }}
              options={[
                { label: '未锁定', value: true },
                { label: '已锁定', value: false },
              ]}
              onChange={(accountNonLocked) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, accountNonLocked }));
              }}
            />
          </Form.Item>
        </>
      }
    >
      <Table<UserResponse>
        rowKey="id"
        columns={columns}
        dataSource={toPageRows(usersQuery.data)}
        loading={usersQuery.isLoading || usersQuery.isFetching}
        scroll={{ x: 1180 }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: toPageTotal(usersQuery.data),
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage({ current, pageSize }),
        }}
      />
      <EntityDrawer
        open={Boolean(detailUser)}
        title="用户详情"
        onClose={() => setDetailUser(null)}
        items={[
          { key: 'username', label: '用户名', children: detailUser?.username ?? '-' },
          { key: 'displayName', label: '显示名称', children: detailUser?.displayName ?? '-' },
          {
            key: 'enabled',
            label: '启用状态',
            children: detailUser ? (
              <BooleanStatusTag value={detailUser.enabled} trueText="启用" falseText="禁用" />
            ) : (
              '-'
            ),
          },
          {
            key: 'accountNonLocked',
            label: '锁定状态',
            children: detailUser ? (
              <BooleanStatusTag
                value={detailUser.accountNonLocked}
                trueText="未锁定"
                falseText="已锁定"
              />
            ) : (
              '-'
            ),
          },
          { key: 'roleCodes', label: '角色', children: detailUser?.roleCodes.join(', ') || '-' },
        ]}
      />
      <Modal
        open={createOpen}
        title="新建用户"
        okText="创建"
        cancelText="取消"
        confirmLoading={createMutation.isPending}
        destroyOnHidden
        onCancel={() => setCreateOpen(false)}
        onOk={() => createForm.submit()}
      >
        <Form<CreateUserFormValues>
          form={createForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) =>
            createMutation.mutate({
              username: values.username,
              password: values.password,
              displayName: values.displayName,
              roleCodes: values.roleCodes ?? [],
            })
          }
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="显示名称"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            label="初始密码"
            rules={[{ required: true, message: '请输入初始密码' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="roleCodes" label="角色">
            <Select
              mode="multiple"
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              options={roleOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={Boolean(resetPasswordUser)}
        title={`重置密码：${resetPasswordUser?.username ?? ''}`}
        okText="重置"
        cancelText="取消"
        confirmLoading={resetPasswordMutation.isPending}
        destroyOnHidden
        onCancel={() => setResetPasswordUser(null)}
        onOk={() => resetPasswordForm.submit()}
      >
        <Form<ResetPasswordFormValues>
          form={resetPasswordForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => {
            if (resetPasswordUser) {
              resetPasswordMutation.mutate({ user: resetPasswordUser, values });
            }
          }}
        >
          <Form.Item
            name="password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={Boolean(rolesUser)}
        title={`更新角色：${rolesUser?.username ?? ''}`}
        okText="保存"
        cancelText="取消"
        confirmLoading={updateRolesMutation.isPending}
        destroyOnHidden
        onCancel={() => setRolesUser(null)}
        onOk={() => rolesForm.submit()}
      >
        <Form<UpdateRolesFormValues>
          form={rolesForm}
          layout="vertical"
          onFinish={(values) => {
            if (rolesUser) {
              updateRolesMutation.mutate({ user: rolesUser, values });
            }
          }}
        >
          <Form.Item name="roleCodes" label="角色">
            <Select
              mode="multiple"
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              options={roleOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </SystemPageShell>
  );
}

function showMutationError(error: unknown) {
  message.error(error instanceof Error ? error.message : '操作失败');
}
