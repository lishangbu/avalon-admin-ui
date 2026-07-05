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
  type BattleActionValidationRequest,
  type BattleActionValidationResponse,
} from '../../../services/battle-rules';
import {
  apiErrorMessage,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';
import { message } from '../../../shared/feedback/message';

interface ActionValidationParticipantForm {
  actorId?: string;
  creatureId?: number;
  level?: number;
  skillIds?: number[];
  abilityId?: number;
  itemId?: number;
}

interface ActionValidationSideForm {
  sideId?: string;
  activeActorIds?: string[];
  participants?: ActionValidationParticipantForm[];
}

interface ActionForm {
  type?: string;
  actorId?: string;
  skillId?: number;
  targetActorId?: string;
}

interface ActionValidationFormValues {
  formatCode?: string;
  sides?: ActionValidationSideForm[];
  actions?: ActionForm[];
}

type ActionViolation = BattleActionValidationResponse['violations'][number];

const requiredArrayRule = [
  { required: true, type: 'array' as const, min: 1, message: '请选择至少一项' },
];

const actionTypeOptions = [
  { label: '使用技能', value: 'USE_SKILL' },
  { label: '替换成员', value: 'SWITCH_PARTICIPANT' },
];

const violationColumns: ColumnsType<ActionViolation> = [
  { title: '违规编码', dataIndex: 'code', width: 200 },
  { title: '行动成员', dataIndex: 'actorId', width: 150, render: renderOptionalText },
  { title: '目标成员', dataIndex: 'targetActorId', width: 150, render: renderOptionalText },
  { title: '资料编号', dataIndex: 'resourceId', width: 120, render: renderOptionalText },
  { title: '说明', dataIndex: 'message', render: renderOptionalText },
];

export function ActionValidationPage() {
  const [form] = Form.useForm<ActionValidationFormValues>();
  const [validationResult, setValidationResult] = useState<BattleActionValidationResponse | null>(
    null,
  );
  // 行动校验入口可能因为队伍准备阶段不合法而直接返回 ApiError，而不是返回行动违规表格。
  // 这类错误属于运行时启动前的资料边界问题，需要稳定展示在页面上；只用 toast 会让排查者丢失后端给出的
  // 具体中文原因，例如等级超过赛制上限、禁用资料或队伍结构不符合当前赛制。
  const [validationError, setValidationError] = useState<string | null>(null);
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const initialValues = useMemo(() => createDefaultValues(), []);

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
    mutationFn: (values: ActionValidationFormValues) =>
      battleRulesServices.runtime.validateActions(toValidationRequest(values)),
    onSuccess: (result) => {
      setValidationError(null);
      setValidationResult(result);
      message.success(result.valid ? '行动校验已通过' : '行动校验发现违规项');
    },
    onError: (error) => {
      const errorMessage = apiErrorMessage(error, '行动校验失败');
      setValidationError(errorMessage);
      message.error(errorMessage);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            行动校验
          </Typography.Title>
          <Typography.Text type="secondary">校验当前回合行动是否能提交到战斗引擎。</Typography.Text>
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
                        label="队伍标识"
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
                                  label="成员标识"
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

          <Form.List name="actions">
            {(actionFields, actionOperations) => (
              <div className="mt-4 space-y-3">
                <Typography.Title level={5} className="!mb-0">
                  本回合行动
                </Typography.Title>
                {actionFields.map((actionField, actionIndex) => (
                  <div
                    key={actionField.key}
                    className="rounded border border-solid border-gray-200 p-3"
                  >
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <Typography.Text strong>行动 {actionIndex + 1}</Typography.Text>
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        disabled={actionFields.length <= 1}
                        onClick={() => actionOperations.remove(actionField.name)}
                      >
                        删除行动
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                      <Form.Item
                        name={[actionField.name, 'type']}
                        label="行动类型"
                        rules={requiredSelectRule}
                      >
                        <Select options={actionTypeOptions} placeholder="选择行动类型" />
                      </Form.Item>
                      <Form.Item
                        name={[actionField.name, 'actorId']}
                        label="行动成员"
                        rules={requiredRule}
                      >
                        <Input placeholder="side-a-1" />
                      </Form.Item>
                      <Form.Item name={[actionField.name, 'skillId']} label="技能">
                        <Select
                          allowClear
                          showSearch={{ optionFilterProp: 'label' }}
                          options={options.skillOptions}
                          loading={options.loading}
                          placeholder="使用技能时选择"
                        />
                      </Form.Item>
                      <Form.Item
                        name={[actionField.name, 'targetActorId']}
                        label="目标成员"
                        rules={requiredRule}
                      >
                        <Input placeholder="side-b-1 或后备成员" />
                      </Form.Item>
                    </div>
                  </div>
                ))}

                <Button
                  icon={<PlusOutlined />}
                  onClick={() => actionOperations.add(createDefaultAction(actionFields.length))}
                >
                  添加行动
                </Button>
              </div>
            )}
          </Form.List>

          <Space className="mt-4">
            <Button type="primary" htmlType="submit" loading={validateMutation.isPending}>
              开始校验
            </Button>
            <Button onClick={clearValidationResult}>清空结果</Button>
          </Space>
        </Form>
      </Card>

      {validationError ? (
        <Alert showIcon type="error" title="行动校验失败" description={validationError} />
      ) : null}

      {validationResult ? (
        <Card size="small">
          <Alert
            showIcon
            className="mb-3"
            type={validationResult.valid ? 'success' : 'error'}
            title={validationResult.valid ? '行动校验通过' : '行动校验未通过'}
          />
          <Table<ActionViolation>
            rowKey={actionViolationKey}
            columns={violationColumns}
            dataSource={validationResult.violations}
            pagination={false}
            scroll={{ x: 840 }}
          />
        </Card>
      ) : null}
    </div>
  );

  function resetForm() {
    form.setFieldsValue(createDefaultValues());
    setValidationResult(null);
    setValidationError(null);
  }

  function clearValidationResult() {
    setValidationResult(null);
    setValidationError(null);
  }
}

function createDefaultValues(): ActionValidationFormValues {
  return {
    formatCode: 'official-double',
    sides: [createDefaultSide(0), createDefaultSide(1)],
    actions: [createDefaultAction(0), createDefaultAction(1)],
  };
}

function actionViolationKey(record: ActionViolation): string {
  return [
    record.code,
    record.actorId,
    record.targetActorId ?? 'none',
    record.resourceId ?? 'none',
    record.message,
  ].join('-');
}

function createDefaultSide(index: number): ActionValidationSideForm {
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
): ActionValidationParticipantForm {
  const sideCode = sideIndex === 0 ? 'side-a' : 'side-b';
  return {
    actorId: `${sideCode}-${participantIndex + 1}`,
    creatureId: participantIndex + 1,
    level: 50,
    skillIds: [1, 2, 3, 4],
  };
}

function createDefaultAction(index: number): ActionForm {
  if (index === 0) {
    return {
      type: 'USE_SKILL',
      actorId: 'side-a-1',
      skillId: 1,
      targetActorId: 'side-b-1',
    };
  }
  return {
    type: 'USE_SKILL',
    actorId: 'side-b-1',
    skillId: 1,
    targetActorId: 'side-a-1',
  };
}

function toValidationRequest(values: ActionValidationFormValues): BattleActionValidationRequest {
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
    actions: (values.actions ?? []).map((action) => ({
      type: action.type?.trim() ?? '',
      actorId: action.actorId?.trim() ?? '',
      skillId: action.skillId,
      targetActorId: action.targetActorId?.trim() ?? '',
    })),
  };
}
