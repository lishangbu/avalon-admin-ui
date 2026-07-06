import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleSkillChargeSkipWeatherRequest,
  type BattleSkillChargeSkipWeatherResponse,
  type BattleSkillWeatherModifierListQuery,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  defaultPageState,
  renderEnabledTag,
  renderOptionLabel,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';
import { message } from '../../../shared/feedback/message';

interface SkillChargeSkipWeatherFilters {
  skillRuleId?: number;
  weatherRuleId?: number;
}

export function SkillChargeSkipWeathersPage() {
  const [filters, setFilters] = useState<SkillChargeSkipWeatherFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillChargeSkipWeatherResponse | null>(
    null,
  );
  const [form] = Form.useForm<BattleSkillChargeSkipWeatherRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['skillRules', 'weatherRules']);

  const query = useMemo<BattleSkillWeatherModifierListQuery>(
    () => ({
      skillRuleId: filters.skillRuleId,
      weatherRuleId: filters.weatherRuleId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const skipWeathersQuery = useQuery({
    queryKey: ['battle-rules', 'skill-charge-skip-weathers', query],
    queryFn: () => battleRulesServices.skillChargeSkipWeathers.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillChargeSkipWeatherRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.skillChargeSkipWeathers.create(values);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能蓄力天气规则');
      }
      return battleRulesServices.skillChargeSkipWeathers.update(editingRecord.id, values);
    },
    onSuccess: async () => {
      message.success('技能蓄力天气规则已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-charge-skip-weathers'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能蓄力天气规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillChargeSkipWeatherResponse) =>
      battleRulesServices.skillChargeSkipWeathers.remove(record.id),
    onSuccess: async () => {
      message.success('技能蓄力天气规则已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-charge-skip-weathers'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能蓄力天气规则失败')),
  });

  const columns: ColumnsType<BattleSkillChargeSkipWeatherResponse> = [
    {
      title: '技能规则',
      dataIndex: 'skillRuleId',
      width: 320,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.skillRuleOptions, value),
    },
    {
      title: '天气规则',
      dataIndex: 'weatherRuleId',
      width: 180,
      render: (value?: number) => renderOptionLabel(options.weatherRuleOptions, value),
    },
    { title: '启用', dataIndex: 'enabled', width: 90, render: renderEnabledTag },
    { title: '排序', dataIndex: 'sortOrder', width: 90 },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除技能蓄力天气规则"
            description="确认删除该技能蓄力天气规则？"
            okText="删除"
            cancelText="取消"
            okType="danger"
            onConfirm={() => removeMutation.mutate(record)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
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
            技能蓄力天气
          </Typography.Title>
          <Typography.Text type="secondary">
            维护蓄力技能在指定天气下跳过等待回合的规则。
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建规则
        </Button>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="技能规则" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部技能规则"
              options={options.skillRuleOptions}
              loading={options.loading}
              style={{ width: 320 }}
              value={filters.skillRuleId}
              onChange={(skillRuleId) => updateFilter({ skillRuleId })}
            />
          </Form.Item>
          <Form.Item label="天气规则" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部天气"
              options={options.weatherRuleOptions}
              loading={options.loading}
              style={{ width: 220 }}
              value={filters.weatherRuleId}
              onChange={(weatherRuleId) => updateFilter({ weatherRuleId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillChargeSkipWeatherResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(skipWeathersQuery.data)}
          loading={skipWeathersQuery.isLoading || skipWeathersQuery.isFetching}
          scroll={{ x: 850 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(skipWeathersQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        forceRender
        open={modalOpen}
        title={modalMode === 'create' ? '新建技能蓄力天气规则' : '编辑技能蓄力天气规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="skillRuleId" label="技能规则" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.skillRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="weatherRuleId" label="天气规则" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.weatherRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Space size="large">
            <Form.Item name="enabled" label="启用" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="sortOrder" label="排序" rules={requiredRule}>
              <InputNumber min={0} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );

  function updateFilter(next: Partial<SkillChargeSkipWeatherFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillChargeSkipWeatherResponse) {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }
}
