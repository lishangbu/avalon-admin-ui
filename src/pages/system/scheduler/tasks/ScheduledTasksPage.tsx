import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../../../shared/components/EntityDrawer';
import { JsonPreview } from '../../../../shared/components/JsonPreview';
import { BooleanStatusTag, TextStatusTag } from '../../../../shared/components/StatusTag';
import {
  systemServices,
  type PageQuery,
  type ScheduledTaskExecutionResponse,
  type ScheduledTaskRequestPayload,
  type ScheduledTaskResponse,
} from '../../../../services/system';
import { SystemPageShell } from '../../shared/SystemPageShell';
import {
  formatDateTime,
  parseJsonObject,
  stringifyJsonObject,
  toPageRows,
  toPageTotal,
  type JsonObject,
} from '../../shared/page-utils';

interface TaskFilters {
  q: string;
}

interface TaskFormValues {
  code: string;
  handlerCode: string;
  name: string;
  description?: string;
  groupName: string;
  scheduleType: string;
  cronExpression?: string;
  intervalSeconds?: number;
  runAt?: string;
  timeZone: string;
  payloadText: string;
  enabled: boolean;
}

interface TriggerFormValues {
  payloadText: string;
}

type TaskModalMode = 'create' | 'edit';

const SCHEDULE_TYPE_OPTIONS = [
  { label: 'CRON', value: 'CRON' },
  { label: 'FIXED_INTERVAL', value: 'FIXED_INTERVAL' },
  { label: 'ONCE', value: 'ONCE' },
];

/**
 * 定时任务管理页。
 *
 * 该页直接操作后端持久化调度任务。payload 在 UI 中以 JSON 文本编辑，提交前必须解析成对象；
 * 如果 JSON 不是对象会在前端阻止提交，避免后端收到数组、字符串等不符合任务语义的数据。
 */
export function ScheduledTasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailTask, setDetailTask] = useState<ScheduledTaskResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<TaskModalMode>('create');
  const [editingTask, setEditingTask] = useState<ScheduledTaskResponse | null>(null);
  const [triggerTask, setTriggerTask] = useState<ScheduledTaskResponse | null>(null);
  const [executionsTask, setExecutionsTask] = useState<ScheduledTaskResponse | null>(null);
  const [form] = Form.useForm<TaskFormValues>();
  const [triggerForm] = Form.useForm<TriggerFormValues>();
  const queryClient = useQueryClient();

  const query = useMemo<PageQuery>(
    () => ({
      q: filters.q || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const tasksQuery = useQuery({
    queryKey: ['system', 'scheduled-tasks', query],
    queryFn: () => systemServices.scheduledTasks.list(query),
  });

  const executionsQuery = useQuery({
    queryKey: ['system', 'scheduled-task-executions', executionsTask?.id],
    queryFn: () =>
      executionsTask
        ? systemServices.scheduledTasks.executions(executionsTask.id, { page: 0, size: 20 })
        : Promise.resolve({ rows: [], totalRowCount: 0 }),
    enabled: Boolean(executionsTask),
  });

  const invalidateTasks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['system', 'scheduled-tasks'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: TaskFormValues) => {
      const payload = toTaskPayload(values);
      if (modalMode === 'create') {
        return systemServices.scheduledTasks.create(payload);
      }
      if (!editingTask) {
        throw new Error('缺少正在编辑的定时任务');
      }
      return systemServices.scheduledTasks.update(editingTask.id, payload);
    },
    onSuccess: async () => {
      message.success('定时任务已保存');
      closeModal();
      await invalidateTasks();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '保存失败'),
  });

  const stateMutation = useMutation({
    mutationFn: ({ task, enabled }: { task: ScheduledTaskResponse; enabled: boolean }) =>
      enabled
        ? systemServices.scheduledTasks.enable(task.id)
        : systemServices.scheduledTasks.disable(task.id),
    onSuccess: async () => {
      message.success('任务状态已更新');
      await invalidateTasks();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '状态更新失败'),
  });

  const triggerMutation = useMutation({
    mutationFn: ({ task, values }: { task: ScheduledTaskResponse; values: TriggerFormValues }) =>
      systemServices.scheduledTasks.trigger(task.id, {
        payload: parseJsonObject(values.payloadText) as Record<string, Record<string, never>>,
      }),
    onSuccess: async () => {
      message.success('触发请求已提交');
      setTriggerTask(null);
      triggerForm.resetFields();
      await invalidateTasks();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '触发失败'),
  });

  const deleteMutation = useMutation({
    mutationFn: (task: ScheduledTaskResponse) => systemServices.scheduledTasks.remove(task.id),
    onSuccess: async () => {
      message.success('定时任务已删除');
      await invalidateTasks();
    },
    onError: (error) => message.error(error instanceof Error ? error.message : '删除失败'),
  });

  const columns: ColumnsType<ScheduledTaskResponse> = [
    {
      title: '任务编码',
      dataIndex: 'code',
      width: 220,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '处理器',
      dataIndex: 'handlerCode',
      width: 180,
    },
    {
      title: '分组',
      dataIndex: 'groupName',
      width: 120,
    },
    {
      title: '调度类型',
      dataIndex: 'scheduleType',
      width: 150,
      render: (value: string) => <TextStatusTag value={value} />,
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
      title: '触发器状态',
      dataIndex: 'triggerState',
      width: 130,
      render: (value?: string) => <TextStatusTag value={value} />,
    },
    {
      title: '最近执行',
      dataIndex: 'lastExecutionStatus',
      width: 130,
      render: (value?: string) => <TextStatusTag value={value} />,
    },
    {
      title: '下次触发',
      dataIndex: 'nextFireTime',
      width: 180,
      render: formatDateTime,
    },
    {
      title: '操作',
      key: 'actions',
      width: 320,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button type="link" size="small" onClick={() => setDetailTask(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title={record.enabled ? '禁用任务' : '启用任务'}
            description={`确认${record.enabled ? '禁用' : '启用'} ${record.code}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => stateMutation.mutate({ task: record, enabled: !record.enabled })}
          >
            <Button type="link" size="small">
              {record.enabled ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setTriggerTask(record);
              triggerForm.setFieldsValue({ payloadText: stringifyJsonObject(record.payload) });
            }}
          >
            触发
          </Button>
          <Button type="link" size="small" onClick={() => setExecutionsTask(record)}>
            执行记录
          </Button>
          <Popconfirm
            title="删除任务"
            description={`确认删除 ${record.code}？`}
            okText="删除"
            cancelText="取消"
            okType="danger"
            onConfirm={() => deleteMutation.mutate(record)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <SystemPageShell
      title="定时任务"
      description="管理持久化调度任务、手动触发和执行记录。"
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          aria-label="新建任务"
          onClick={openCreateModal}
        >
          新建任务
        </Button>
      }
      filters={
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            placeholder="任务编码、名称、处理器或分组"
            onSearch={(value) => {
              setPage((prev) => ({ ...prev, current: 1 }));
              setFilters({ q: value.trim() });
            }}
          />
        </Form.Item>
      }
    >
      <Table<ScheduledTaskResponse>
        rowKey="id"
        columns={columns}
        dataSource={toPageRows(tasksQuery.data)}
        loading={tasksQuery.isLoading || tasksQuery.isFetching}
        scroll={{ x: 1580 }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: toPageTotal(tasksQuery.data),
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage({ current, pageSize }),
        }}
      />
      <EntityDrawer
        open={Boolean(detailTask)}
        title="定时任务详情"
        onClose={() => setDetailTask(null)}
        items={[
          { key: 'code', label: '任务编码', children: detailTask?.code ?? '-' },
          { key: 'name', label: '名称', children: detailTask?.name ?? '-' },
          { key: 'description', label: '说明', children: detailTask?.description ?? '-' },
          { key: 'handlerCode', label: '处理器', children: detailTask?.handlerCode ?? '-' },
          { key: 'groupName', label: '分组', children: detailTask?.groupName ?? '-' },
          { key: 'scheduleType', label: '调度类型', children: detailTask?.scheduleType ?? '-' },
          { key: 'cronExpression', label: 'Cron', children: detailTask?.cronExpression ?? '-' },
          {
            key: 'intervalSeconds',
            label: '间隔秒数',
            children: detailTask?.intervalSeconds ?? '-',
          },
          { key: 'runAt', label: '一次性执行时间', children: formatDateTime(detailTask?.runAt) },
          { key: 'timeZone', label: '时区', children: detailTask?.timeZone ?? '-' },
          {
            key: 'enabled',
            label: '启用',
            children: detailTask ? (
              <BooleanStatusTag value={detailTask.enabled} trueText="启用" falseText="禁用" />
            ) : (
              '-'
            ),
          },
          {
            key: 'payload',
            label: 'Payload',
            children: <JsonPreview value={detailTask?.payload} />,
          },
          {
            key: 'nextFireTime',
            label: '下次触发',
            children: formatDateTime(detailTask?.nextFireTime),
          },
          {
            key: 'lastExecutionStatus',
            label: '最近执行状态',
            children: <TextStatusTag value={detailTask?.lastExecutionStatus} />,
          },
          {
            key: 'lastExecutionAt',
            label: '最近执行时间',
            children: formatDateTime(detailTask?.lastExecutionAt),
          },
        ]}
      />
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建定时任务' : `编辑任务：${editingTask?.code ?? ''}`}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={760}
      >
        <Form<TaskFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => saveMutation.mutate(values)}
        >
          <Form.Item
            name="code"
            label="任务编码"
            rules={[{ required: true, message: '请输入任务编码' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item
            name="handlerCode"
            label="处理器"
            rules={[{ required: true, message: '请输入处理器 code' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="groupName"
            label="分组"
            rules={[{ required: true, message: '请输入分组' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="scheduleType"
            label="调度类型"
            rules={[{ required: true, message: '请选择调度类型' }]}
          >
            <Select options={SCHEDULE_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="cronExpression" label="Cron 表达式">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="intervalSeconds" label="固定间隔秒数">
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item name="runAt" label="一次性执行时间">
            <Input placeholder="2026-06-26T15:30:00Z" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="timeZone"
            label="时区"
            rules={[{ required: true, message: '请输入时区' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="payloadText"
            label="Payload JSON"
            rules={[{ required: true, message: '请输入 JSON' }]}
          >
            <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="启用状态"
            rules={[{ required: true, message: '请选择启用状态' }]}
          >
            <Select
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={Boolean(triggerTask)}
        title={`手动触发：${triggerTask?.code ?? ''}`}
        okText="触发"
        cancelText="取消"
        confirmLoading={triggerMutation.isPending}
        destroyOnHidden
        onCancel={() => setTriggerTask(null)}
        onOk={() => triggerForm.submit()}
      >
        <Form<TriggerFormValues>
          form={triggerForm}
          layout="vertical"
          onFinish={(values) => {
            if (triggerTask) {
              triggerMutation.mutate({ task: triggerTask, values });
            }
          }}
        >
          <Form.Item name="payloadText" label="本次触发 Payload JSON">
            <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        open={Boolean(executionsTask)}
        title={`执行记录：${executionsTask?.code ?? ''}`}
        size={760}
        destroyOnHidden
        onClose={() => setExecutionsTask(null)}
      >
        <Table<ScheduledTaskExecutionResponse>
          rowKey="id"
          size="small"
          dataSource={toPageRows(executionsQuery.data)}
          loading={executionsQuery.isLoading || executionsQuery.isFetching}
          pagination={false}
          columns={[
            {
              title: '状态',
              dataIndex: 'status',
              width: 110,
              render: (value?: string) => <TextStatusTag value={value} />,
            },
            { title: '触发时间', dataIndex: 'actualFireTime', width: 180, render: formatDateTime },
            { title: '完成时间', dataIndex: 'finishedAt', width: 180, render: formatDateTime },
            {
              title: '耗时',
              dataIndex: 'durationMs',
              width: 100,
              render: (value?: number) => (value ? `${value}ms` : '-'),
            },
            { title: '错误', dataIndex: 'errorMessage', render: (value?: string) => value ?? '-' },
          ]}
        />
      </Drawer>
    </SystemPageShell>
  );

  function openCreateModal() {
    setModalMode('create');
    setEditingTask(null);
    setModalOpen(true);
    form.setFieldsValue({
      scheduleType: 'CRON',
      timeZone: 'UTC',
      payloadText: '{}',
      enabled: true,
    });
  }

  function openEditModal(task: ScheduledTaskResponse) {
    setModalMode('edit');
    setEditingTask(task);
    setModalOpen(true);
    form.setFieldsValue({
      code: task.code,
      handlerCode: task.handlerCode,
      name: task.name,
      description: task.description,
      groupName: task.groupName,
      scheduleType: task.scheduleType,
      cronExpression: task.cronExpression,
      intervalSeconds: task.intervalSeconds,
      runAt: task.runAt,
      timeZone: task.timeZone,
      payloadText: stringifyJsonObject(task.payload),
      enabled: task.enabled,
    });
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
    setModalMode('create');
    form.resetFields();
  }
}

function toTaskPayload(values: TaskFormValues): ScheduledTaskRequestPayload {
  const payload = parseJsonObject(values.payloadText) as JsonObject;
  return {
    code: values.code,
    handlerCode: values.handlerCode,
    name: values.name,
    description: values.description,
    groupName: values.groupName,
    scheduleType: values.scheduleType,
    cronExpression: values.cronExpression || undefined,
    intervalSeconds: values.intervalSeconds,
    runAt: values.runAt || undefined,
    timeZone: values.timeZone,
    payload: payload as Record<string, Record<string, never>>,
    enabled: values.enabled,
  };
}
