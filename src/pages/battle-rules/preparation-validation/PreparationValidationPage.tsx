import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattlePreparationValidationRequest,
  type BattlePreparationValidationResponse,
} from '../../../services/battle-rules';
import {
  apiErrorMessage,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';
import { message } from '../../../shared/feedback/message';

interface PreparationParticipantForm {
  actorId?: string;
  creatureId?: number;
  level?: number;
  skillIds?: number[];
  abilityId?: number;
  itemId?: number;
}

interface PreparationSideForm {
  sideId?: string;
  activeActorIds?: string[];
  participants?: PreparationParticipantForm[];
}

interface PreparationValidationFormValues {
  formatCode?: string;
  sides?: PreparationSideForm[];
}

type PreparationViolation = BattlePreparationValidationResponse['violations'][number];
type BattleRuleOptions = ReturnType<typeof useBattleRuleOptions>;

const requiredArrayRule = [
  { required: true, type: 'array' as const, min: 1, message: '请选择至少一项' },
];

export function PreparationValidationPage() {
  const [form] = Form.useForm<PreparationValidationFormValues>();
  const [validationResult, setValidationResult] =
    useState<BattlePreparationValidationResponse | null>(null);
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const initialValues = useMemo(() => createDefaultValues(), []);
  const violationColumns = useMemo<ColumnsType<PreparationViolation>>(
    () => [
      { title: '违规编码', dataIndex: 'code', width: 180 },
      { title: '队伍侧', dataIndex: 'sideId', width: 120, render: renderOptionalText },
      { title: '成员', dataIndex: 'actorId', width: 140, render: renderOptionalText },
      {
        title: '关联资料',
        dataIndex: 'resourceId',
        width: 180,
        render: (_, record) => renderViolationResource(record, options),
      },
      { title: '说明', dataIndex: 'message', render: renderOptionalText },
    ],
    [options.abilityOptions, options.creatureOptions, options.itemOptions, options.skillOptions],
  );

  const formatCodeOptions = useMemo(
    () =>
      options.formatOptions
        .filter((option) => option.code)
        .map((option) => ({
          label: option.label,
          value: option.code,
        })),
    [options.formatOptions],
  );

  const validateMutation = useMutation({
    mutationFn: (values: PreparationValidationFormValues) =>
      battleRulesServices.runtime.validatePreparation(toValidationRequest(values)),
    onSuccess: (result) => {
      setValidationResult(result);
      message.success(result.valid ? '准备校验已通过' : '准备校验发现违规项');
    },
    onError: (error) => message.error(apiErrorMessage(error, '准备校验失败')),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            准备校验
          </Typography.Title>
          <Typography.Text type="secondary">
            校验队伍是否符合所选赛制的准备阶段规则。
          </Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={resetForm}>
          重置样例
        </Button>
      </div>

      <Card size="small">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={(values) => validateMutation.mutate(values)}
        >
          <Form.Item name="formatCode" label="战斗赛制" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={formatCodeOptions}
              loading={options.loading}
              placeholder="选择赛制"
            />
          </Form.Item>

          <Form.List name="sides">
            {(sideFields, sideOperations) => (
              <div className="space-y-3">
                {sideFields.map((sideField, sideIndex) => (
                  <div
                    key={sideField.key}
                    className="rounded border border-solid border-gray-200 p-3"
                  >
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <Typography.Title level={5} className="!mb-0">
                        队伍 {sideIndex + 1}
                      </Typography.Title>
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        disabled={sideFields.length <= 1}
                        onClick={() => sideOperations.remove(sideField.name)}
                      >
                        删除队伍
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Form.Item
                        name={[sideField.name, 'sideId']}
                        label="队伍侧编号"
                        rules={requiredRule}
                      >
                        <Input placeholder="side-a" />
                      </Form.Item>
                      <Form.Item
                        name={[sideField.name, 'activeActorIds']}
                        label="上场成员"
                        rules={requiredArrayRule}
                      >
                        <Select
                          mode="tags"
                          tokenSeparators={[',', '，', ' ']}
                          maxTagCount="responsive"
                          placeholder="side-a-1, side-a-2"
                        />
                      </Form.Item>
                    </div>

                    <Form.List name={[sideField.name, 'participants']}>
                      {(participantFields, participantOperations) => (
                        <div className="space-y-3">
                          {participantFields.map((participantField, participantIndex) => (
                            <div
                              key={participantField.key}
                              className="rounded border border-dashed border-gray-200 p-3"
                            >
                              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <Typography.Text strong>
                                  成员 {participantIndex + 1}
                                </Typography.Text>
                                <Button
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  disabled={participantFields.length <= 1}
                                  onClick={() =>
                                    participantOperations.remove(participantField.name)
                                  }
                                >
                                  删除成员
                                </Button>
                              </div>

                              <div className="grid gap-3 md:grid-cols-3">
                                <Form.Item
                                  name={[participantField.name, 'actorId']}
                                  label="成员编号"
                                  rules={requiredRule}
                                >
                                  <Input placeholder="side-a-1" />
                                </Form.Item>
                                <Form.Item
                                  name={[participantField.name, 'creatureId']}
                                  label="成员资料"
                                  rules={requiredSelectRule}
                                >
                                  <Select
                                    showSearch={{ optionFilterProp: 'label' }}
                                    options={options.creatureOptions}
                                    loading={options.loading}
                                    placeholder="选择成员资料"
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[participantField.name, 'level']}
                                  label="等级"
                                  rules={requiredRule}
                                >
                                  <InputNumber min={1} max={100} className="w-full" />
                                </Form.Item>
                              </div>

                              <div className="grid gap-3 md:grid-cols-3">
                                <Form.Item
                                  name={[participantField.name, 'skillIds']}
                                  label="技能"
                                  rules={requiredArrayRule}
                                >
                                  <Select
                                    mode="multiple"
                                    showSearch={{ optionFilterProp: 'label' }}
                                    maxTagCount="responsive"
                                    options={options.skillOptions}
                                    loading={options.loading}
                                    placeholder="选择技能"
                                  />
                                </Form.Item>
                                <Form.Item name={[participantField.name, 'abilityId']} label="特性">
                                  <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    options={options.abilityOptions}
                                    loading={options.loading}
                                    placeholder="选择特性"
                                  />
                                </Form.Item>
                                <Form.Item name={[participantField.name, 'itemId']} label="道具">
                                  <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    options={options.itemOptions}
                                    loading={options.loading}
                                    placeholder="选择道具"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          ))}

                          <Button
                            icon={<PlusOutlined />}
                            onClick={() =>
                              participantOperations.add(
                                createDefaultParticipant(sideIndex, participantFields.length),
                              )
                            }
                          >
                            添加成员
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ))}

                <Button
                  icon={<PlusOutlined />}
                  onClick={() => sideOperations.add(createDefaultSide(sideFields.length))}
                >
                  添加队伍
                </Button>
              </div>
            )}
          </Form.List>

          <Space className="mt-4">
            <Button type="primary" htmlType="submit" loading={validateMutation.isPending}>
              开始校验
            </Button>
            <Button onClick={() => setValidationResult(null)}>清空结果</Button>
          </Space>
        </Form>
      </Card>

      {validationResult ? (
        <Card size="small">
          <Alert
            showIcon
            className="mb-3"
            type={validationResult.valid ? 'success' : 'error'}
            title={validationResult.valid ? '准备校验通过' : '准备校验未通过'}
          />
          <Table<PreparationViolation>
            rowKey={(record) =>
              `${record.code}-${record.sideId}-${record.actorId}-${record.resourceId}`
            }
            columns={violationColumns}
            dataSource={validationResult.violations}
            pagination={false}
            scroll={{ x: 760 }}
          />
        </Card>
      ) : null}
    </div>
  );

  function resetForm() {
    form.setFieldsValue(createDefaultValues());
    setValidationResult(null);
  }
}

function createDefaultValues(): PreparationValidationFormValues {
  return {
    formatCode: 'official-double',
    sides: [createDefaultSide(0), createDefaultSide(1)],
  };
}

function createDefaultSide(index: number): PreparationSideForm {
  const sideCode = index === 0 ? 'side-a' : 'side-b';
  return {
    sideId: sideCode,
    activeActorIds: [`${sideCode}-1`, `${sideCode}-2`],
    participants: [createDefaultParticipant(index, 0), createDefaultParticipant(index, 1)],
  };
}

function createDefaultParticipant(
  sideIndex: number,
  participantIndex: number,
): PreparationParticipantForm {
  const sideCode = sideIndex === 0 ? 'side-a' : 'side-b';
  return {
    actorId: `${sideCode}-${participantIndex + 1}`,
    creatureId: participantIndex + 1,
    level: 50,
    skillIds: [1, 2, 3, 4],
  };
}

/**
 * 将准备校验返回的通用 `resourceId` 显示为具体资料名称。
 *
 * 后端为了让 battle-engine 保持纯领域模型，只返回稳定的违规编码和触发资料 ID；资源到底是成员资料、技能、
 * 特性还是道具，需要由管理端根据 `code` 判断。这里不改接口契约，只把已经加载好的下拉 option 复用到结果表格，
 * 让用户看到“妙蛙种子（bulbasaur）”这类可读文本，而不是只能回数据库查的数字 ID。
 */
function renderViolationResource(violation: PreparationViolation, options: BattleRuleOptions) {
  switch (violation.code) {
    case 'banned-creature':
    case 'duplicate-creature':
    case 'level-too-high':
      return renderOptionLabel(options.creatureOptions, violation.resourceId);
    case 'banned-skill':
      return renderOptionLabel(options.skillOptions, violation.resourceId);
    case 'banned-ability':
      return renderOptionLabel(options.abilityOptions, violation.resourceId);
    case 'banned-item':
    case 'duplicate-item':
      return renderOptionLabel(options.itemOptions, violation.resourceId);
    default:
      return renderOptionalText(violation.resourceId);
  }
}

function toValidationRequest(
  values: PreparationValidationFormValues,
): BattlePreparationValidationRequest {
  return {
    formatCode: values.formatCode?.trim() ?? '',
    sides: (values.sides ?? []).map((side) => ({
      sideId: side.sideId?.trim() ?? '',
      activeActorIds: (side.activeActorIds ?? []).map((actorId) => actorId.trim()).filter(Boolean),
      participants: (side.participants ?? []).map((participant) => ({
        actorId: participant.actorId?.trim() ?? '',
        creatureId: Number(participant.creatureId),
        level: Number(participant.level),
        skillIds: participant.skillIds ?? [],
        abilityId: participant.abilityId,
        itemId: participant.itemId,
      })),
    })),
  };
}
