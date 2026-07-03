import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import {
  systemServices,
  type AccessNodeResponse,
  type CreateRoleRequest,
  type RoleListQuery,
  type RoleResponse,
  type UpdateRoleRequest,
} from '../../../../services/system';
import { toPageRows, toPageTotal } from '../../shared/page-utils';
import { message } from '../../../../shared/feedback/message';

interface RoleFilters {
  q: string;
  accessNodeCode?: string;
}

interface RoleFormValues {
  code?: string;
  name: string;
  accessNodeCodes?: string[];
}

type RoleModalMode = 'create' | 'edit';

/**
 * 角色管理页。
 *
 * 角色是用户与访问节点之间的授权中间层。后端接口约定创建和编辑都提交完整访问节点集合，
 * 因此前端表单不做增量 patch，保存时直接发送当前选择的完整 accessNodeCodes。
 */
export function RolesPage() {
  const [filters, setFilters] = useState<RoleFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailRole, setDetailRole] = useState<RoleResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<RoleModalMode>('create');
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [form] = Form.useForm<RoleFormValues>();
  const queryClient = useQueryClient();

  const accessNodeQuery = useQuery({
    queryKey: ['system', 'access-nodes', 'options'],
    queryFn: () => systemServices.accessNodes.list({ page: 0, size: 100 }),
  });

  const query = useMemo<RoleListQuery>(
    () => ({
      q: filters.q || undefined,
      accessNodeCode: filters.accessNodeCode,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const rolesQuery = useQuery({
    queryKey: ['system', 'roles', query],
    queryFn: () => systemServices.roles.list(query),
  });

  const accessNodeOptions = toPageRows(accessNodeQuery.data).map((node: AccessNodeResponse) => ({
    label: `${node.name} (${node.code})`,
    value: node.code,
  }));

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries({ queryKey: ['system', 'roles'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: RoleFormValues) => {
      if (modalMode === 'create') {
        const payload: CreateRoleRequest = {
          code: values.code ?? '',
          name: values.name,
          accessNodeCodes: values.accessNodeCodes ?? [],
        };
        return systemServices.roles.create(payload);
      }

      if (!editingRole) {
        throw new Error('缺少正在编辑的角色');
      }

      const payload: UpdateRoleRequest = {
        name: values.name,
        accessNodeCodes: values.accessNodeCodes ?? [],
      };
      return systemServices.roles.update(editingRole.id, payload);
    },
    onSuccess: async () => {
      message.success('角色已保存');
      closeModal();
      await invalidateRoles();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '保存失败'),
  });

  const columns: ColumnsType<RoleResponse> = [
    {
      title: '角色编码',
      dataIndex: 'code',
      width: 180,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '访问节点',
      dataIndex: 'accessNodeCodes',
      render: (codes: string[]) => (
        <Space size={[4, 4]} wrap>
          {codes.map((code) => (
            <Tag key={code}>{code}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => setDetailRole(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            角色管理
          </Typography.Title>
          <Typography.Text type="secondary">维护角色基础信息和访问节点授权。</Typography.Text>
        </div>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            aria-label="新建角色"
            onClick={openCreateModal}
          >
            新建角色
          </Button>
        </Space>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="角色编码或名称"
              onSearch={(value) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, q: value.trim() }));
              }}
            />
          </Form.Item>
          <Form.Item label="访问节点" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              aria-label="访问节点"
              placeholder="全部节点"
              options={accessNodeOptions}
              style={{ width: 280 }}
              onChange={(accessNodeCode) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters((prev) => ({ ...prev, accessNodeCode }));
              }}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<RoleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(rolesQuery.data)}
          loading={rolesQuery.isLoading || rolesQuery.isFetching}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(rolesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
        <EntityDrawer
          open={Boolean(detailRole)}
          title="角色详情"
          onClose={() => setDetailRole(null)}
          items={[
            { key: 'code', label: '角色编码', children: detailRole?.code ?? '-' },
            { key: 'name', label: '角色名称', children: detailRole?.name ?? '-' },
            {
              key: 'accessNodeCodes',
              label: '访问节点',
              children: detailRole?.accessNodeCodes.join(', ') || '-',
            },
          ]}
        />
        <Modal
          open={modalOpen}
          title={modalMode === 'create' ? '新建角色' : `编辑角色：${editingRole?.code ?? ''}`}
          okText="保存"
          cancelText="取消"
          confirmLoading={saveMutation.isPending}
          destroyOnHidden
          onCancel={closeModal}
          onOk={() => form.submit()}
        >
          <Form<RoleFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(values) => saveMutation.mutate(values)}
          >
            <Form.Item
              name="code"
              label="角色编码"
              rules={[{ required: modalMode === 'create', message: '请输入角色编码' }]}
            >
              <Input disabled={modalMode === 'edit'} autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item name="accessNodeCodes" label="访问节点">
              <Select
                mode="multiple"
                allowClear
                showSearch={{ optionFilterProp: 'label' }}
                options={accessNodeOptions}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );

  function openCreateModal() {
    setModalMode('create');
    setEditingRole(null);
    setModalOpen(true);
    form.resetFields();
  }

  function openEditModal(role: RoleResponse) {
    setModalMode('edit');
    setEditingRole(role);
    setModalOpen(true);
    form.setFieldsValue({
      code: role.code,
      name: role.name,
      accessNodeCodes: role.accessNodeCodes,
    });
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRole(null);
    setModalMode('create');
    form.resetFields();
  }
}
