import { CopyOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
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
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleSandboxService,
  type BattleActionViolationResponse,
  type BattleSandboxEvent,
  type BattleSandboxParticipant,
  type BattleSandboxRandomTrace,
  type BattleSandboxStateSnapshot,
  type BattleSandboxTurnRequest,
  type BattleSandboxTurnResponse,
  type BattleSandboxTurnRecord,
} from '../../services/battle-sandbox';
import { JsonPreview } from '../../shared/components/JsonPreview';
import { message } from '../../shared/feedback/message';
import {
  apiErrorMessage,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
} from '../battle-rules/shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../battle-rules/shared/useBattleRuleOptions';

interface SandboxParticipantForm {
  actorId?: string;
  creatureId?: number;
  level?: number;
  skillIds?: number[];
  abilityId?: number;
  itemId?: number;
}

interface SandboxSideForm {
  sideId?: string;
  activeActorIds?: string[];
  participants?: SandboxParticipantForm[];
}

interface SandboxActionForm {
  type?: string;
  actorId?: string;
  skillId?: number;
  targetActorId?: string;
}

interface BattleSandboxFormValues {
  formatCode?: string;
  randomSeed?: number;
  sides?: SandboxSideForm[];
  actions?: SandboxActionForm[];
}

interface ActorOption {
  label: string;
  value: string;
}

interface ParticipantRow extends BattleSandboxParticipant {
  key: string;
  sideId: string;
}

interface EventRow extends BattleSandboxEvent {
  key: string;
}

const requiredArrayRule = [
  { required: true, type: 'array' as const, min: 1, message: '请选择至少一项' },
];

const actionTypeOptions = [
  { label: '使用技能', value: 'USE_SKILL' },
  { label: '替换成员', value: 'SWITCH_PARTICIPANT' },
];

const eventTypeLabels: Record<string, string> = {
  BattleStarted: '战斗开始',
  TurnStarted: '回合开始',
  SkillUsed: '使用技能',
  DamageApplied: '造成伤害',
  HealingApplied: '体力回复',
  ParticipantFainted: '精灵倒下',
  ParticipantSwitched: '替换精灵',
  TurnEnded: '回合结束',
  BattleEnded: '战斗结束',
};

export function BattleSandboxPage() {
  const [form] = Form.useForm<BattleSandboxFormValues>();
  const [result, setResult] = useState<BattleSandboxTurnResponse | null>(null);
  const sides = Form.useWatch('sides', form);
  const actorOptions = useMemo(() => createActorOptions(sides), [sides]);
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const initialValues = useMemo(() => createDefaultValues(), []);
  const battleEnded = Boolean(result?.result);

  const formatCodeOptions = useMemo(
    () =>
      options.formatOptions
        .filter((option) => option.code)
        .map((option) => ({ label: option.label, value: option.code })),
    [options.formatOptions],
  );

  const participantColumns = useMemo<ColumnsType<ParticipantRow>>(
    () => [
      { title: '队伍', dataIndex: 'sideId', width: 110 },
      {
        title: '精灵',
        dataIndex: 'creatureId',
        width: 180,
        render: (value) => renderOptionLabel(options.creatureOptions, value),
      },
      { title: '成员编号', dataIndex: 'actorId', width: 160 },
      { title: '上场', dataIndex: 'active', width: 90, render: renderActiveTag },
      { title: '等级', dataIndex: 'level', width: 90 },
      { title: 'HP', width: 120, render: (_, record) => `${record.currentHp}/${record.maxHp}` },
      { title: '主要状态', dataIndex: 'majorStatus', width: 120, render: renderOptionalText },
      {
        title: '技能槽',
        dataIndex: 'skillSlots',
        render: (_, record) =>
          record.skillSlots
            .map((slot) => `${slot.name} ${slot.remainingPp}/${slot.maxPp}`)
            .join('、'),
      },
    ],
    [options.creatureOptions],
  );

  const resolveMutation = useMutation({
    mutationFn: (values: BattleSandboxFormValues) =>
      battleSandboxService.resolveTurn(
        toSandboxRequest(values, result?.result ? undefined : result?.state),
      ),
    onSuccess: (response) => {
      setResult(response);
      message.success(response.resolved ? '回合结算完成' : '行动校验未通过');
    },
    onError: (error) => message.error(apiErrorMessage(error, '沙盒结算失败')),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            战斗沙盒
          </Typography.Title>
          <Typography.Text type="secondary">
            配置双方队伍和回合行动，按当前规则结算一回合。
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
          onValuesChange={clearResultWhenSetupChanges}
          onFinish={(values) => resolveMutation.mutate(values)}
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
            <Form.Item name="formatCode" label="战斗赛制" rules={requiredSelectRule}>
              <Select
                showSearch={{ optionFilterProp: 'label' }}
                options={formatCodeOptions}
                loading={options.loading}
                placeholder="选择赛制"
              />
            </Form.Item>
            <Form.Item name="randomSeed" label="随机种子" rules={requiredRule}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <SidesEditor sides={sides} options={options} />
          <ActionsEditor actorOptions={actorOptions} options={options} />

          <Space className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={resolveMutation.isPending}
              disabled={battleEnded}
            >
              {battleEnded ? '战斗已结束' : result ? '继续结算' : '结算回合'}
            </Button>
            <Button disabled={!result} onClick={() => setResult(null)}>
              重开战斗
            </Button>
          </Space>
        </Form>
      </Card>

      {result ? (
        <Card size="small">
          <Alert
            showIcon
            className="mb-3"
            type={result.resolved ? 'success' : 'warning'}
            title={result.resolved ? '回合结算完成' : '行动校验未通过'}
            description={renderResultDescription(result)}
          />

          <div className="space-y-4">
            <section>
              <Typography.Title level={5}>双方状态</Typography.Title>
              <Table<ParticipantRow>
                rowKey="key"
                columns={participantColumns}
                dataSource={participantRows(result)}
                pagination={false}
                scroll={{ x: 900 }}
              />
            </section>

            {result.violations.length > 0 ? (
              <section>
                <Typography.Title level={5}>行动违规</Typography.Title>
                <Table<BattleActionViolationResponse>
                  rowKey={violationKey}
                  columns={violationColumns}
                  dataSource={result.violations}
                  pagination={false}
                  scroll={{ x: 760 }}
                />
              </section>
            ) : null}

            <section>
              <Typography.Title level={5}>事件流</Typography.Title>
              <Table<EventRow>
                rowKey="key"
                columns={eventColumns}
                dataSource={eventRows(result)}
                pagination={false}
                scroll={{ x: 760 }}
                expandable={{
                  expandedRowRender: (record) => <JsonPreview value={record.payload} />,
                  rowExpandable: (record) => Object.keys(record.payload ?? {}).length > 0,
                }}
              />
            </section>

            <section>
              <Typography.Title level={5}>随机轨迹</Typography.Title>
              <Table<BattleSandboxRandomTrace>
                rowKey={(record) => String(record.sequence)}
                columns={randomTraceColumns}
                dataSource={result.randomTrace}
                pagination={false}
                scroll={{ x: 620 }}
              />
            </section>

            <section>
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <Typography.Title level={5} className="!mb-0">
                  已结算回合
                </Typography.Title>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  disabled={result.state.turns.length === 0}
                  onClick={() => copySandboxState(result.state)}
                >
                  复制复盘 JSON
                </Button>
              </div>
              <Table<BattleSandboxTurnRecord>
                rowKey={(record) => String(record.turnNumber)}
                columns={turnRecordColumns}
                dataSource={result.state.turns}
                pagination={false}
                scroll={{ x: 760 }}
                expandable={{
                  expandedRowRender: (record) => <JsonPreview value={record} />,
                }}
              />
            </section>
          </div>
        </Card>
      ) : null}
    </div>
  );

  function resetForm() {
    form.setFieldsValue(createDefaultValues());
    setResult(null);
  }

  function clearResultWhenSetupChanges(changedValues: Partial<BattleSandboxFormValues>) {
    if ('formatCode' in changedValues || 'sides' in changedValues) {
      setResult(null);
    }
  }
}

function SidesEditor({
  sides,
  options,
}: {
  sides: SandboxSideForm[] | undefined;
  options: ReturnType<typeof useBattleRuleOptions>;
}) {
  return (
    <Form.List name="sides">
      {(sideFields, sideOperations) => (
        <div className="space-y-3">
          {sideFields.map((sideField, sideIndex) => {
            const activeActorOptions = createParticipantActorOptions(
              sides?.[sideIndex]?.participants,
            );

            return (
              <div key={sideField.key} className="rounded border border-solid border-gray-200 p-3">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <Typography.Title level={5} className="!mb-0">
                    队伍 {sideIndex + 1}
                  </Typography.Title>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={sideFields.length <= 2}
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
                      mode="multiple"
                      maxTagCount="responsive"
                      options={activeActorOptions}
                      placeholder="选择上场成员"
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
                            <Typography.Text strong>成员 {participantIndex + 1}</Typography.Text>
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              disabled={participantFields.length <= 1}
                              onClick={() => participantOperations.remove(participantField.name)}
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
                              label="精灵"
                              rules={requiredSelectRule}
                            >
                              <Select
                                showSearch={{ optionFilterProp: 'label' }}
                                options={options.creatureOptions}
                                loading={options.loading}
                                placeholder="选择精灵"
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
                                placeholder="可选"
                              />
                            </Form.Item>
                            <Form.Item name={[participantField.name, 'itemId']} label="道具">
                              <Select
                                allowClear
                                showSearch={{ optionFilterProp: 'label' }}
                                options={options.itemOptions}
                                loading={options.loading}
                                placeholder="可选"
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
            );
          })}

          <Button
            icon={<PlusOutlined />}
            onClick={() => sideOperations.add(createDefaultSide(sideFields.length))}
          >
            添加队伍
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function ActionsEditor({
  actorOptions,
  options,
}: {
  actorOptions: ActorOption[];
  options: ReturnType<typeof useBattleRuleOptions>;
}) {
  return (
    <Form.List name="actions">
      {(actionFields, actionOperations) => (
        <div className="mt-4 space-y-3">
          <Typography.Title level={5} className="!mb-0">
            本回合行动
          </Typography.Title>
          {actionFields.map((actionField, actionIndex) => (
            <div key={actionField.key} className="rounded border border-solid border-gray-200 p-3">
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
                  rules={requiredSelectRule}
                >
                  <Select
                    showSearch={{ optionFilterProp: 'label' }}
                    options={actorOptions}
                    placeholder="选择行动成员"
                  />
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const actionType = getFieldValue(['actions', actionField.name, 'type']);
                    return (
                      <Form.Item
                        name={[actionField.name, 'skillId']}
                        label="技能"
                        rules={actionType === 'USE_SKILL' ? requiredSelectRule : undefined}
                      >
                        <Select
                          allowClear
                          disabled={actionType !== 'USE_SKILL'}
                          showSearch={{ optionFilterProp: 'label' }}
                          options={options.skillOptions}
                          loading={options.loading}
                          placeholder={actionType === 'USE_SKILL' ? '选择技能' : '替换成员无需技能'}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  name={[actionField.name, 'targetActorId']}
                  label="目标成员"
                  rules={requiredSelectRule}
                >
                  <Select
                    showSearch={{ optionFilterProp: 'label' }}
                    options={actorOptions}
                    placeholder="选择目标成员"
                  />
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
  );
}

const eventColumns: ColumnsType<EventRow> = [
  { title: '回合', dataIndex: 'turnNumber', width: 90 },
  { title: '事件', dataIndex: 'type', width: 140, render: renderEventType },
  { title: '说明', dataIndex: 'message', render: renderOptionalText },
];

const randomTraceColumns: ColumnsType<BattleSandboxRandomTrace> = [
  { title: '序号', dataIndex: 'sequence', width: 90 },
  { title: '原因', dataIndex: 'reason', width: 180 },
  { title: '上界', dataIndex: 'bound', width: 120 },
  { title: '结果', dataIndex: 'value', width: 120 },
];

const turnRecordColumns: ColumnsType<BattleSandboxTurnRecord> = [
  { title: '回合', dataIndex: 'turnNumber', width: 90 },
  {
    title: '行动',
    dataIndex: 'actions',
    render: (_, record) => record.actions.map(renderSandboxAction).join('、'),
  },
  {
    title: '随机数',
    dataIndex: 'randomTrace',
    width: 110,
    render: (_, record) => record.randomTrace.length,
  },
  {
    title: '事件数',
    dataIndex: 'events',
    width: 110,
    render: (_, record) => record.events.length,
  },
];

const violationColumns: ColumnsType<BattleActionViolationResponse> = [
  { title: '违规编码', dataIndex: 'code', width: 200 },
  { title: '行动成员', dataIndex: 'actorId', width: 150, render: renderOptionalText },
  { title: '目标成员', dataIndex: 'targetActorId', width: 150, render: renderOptionalText },
  { title: '资料编号', dataIndex: 'resourceId', width: 120, render: renderOptionalText },
  { title: '说明', dataIndex: 'message', render: renderOptionalText },
];

function createDefaultValues(): BattleSandboxFormValues {
  return {
    formatCode: 'standard-single',
    randomSeed: 0,
    sides: [createDefaultSide(0), createDefaultSide(1)],
    actions: [createDefaultAction(0), createDefaultAction(1)],
  };
}

function createDefaultSide(index: number): SandboxSideForm {
  const sideCode = index === 0 ? 'side-a' : `side-${String.fromCharCode(97 + index)}`;
  return {
    sideId: sideCode,
    activeActorIds: [`${sideCode}-1`],
    participants: [createDefaultParticipant(index, 0), createDefaultParticipant(index, 1)],
  };
}

function createDefaultParticipant(
  sideIndex: number,
  participantIndex: number,
): SandboxParticipantForm {
  const sideCode = sideIndex === 0 ? 'side-a' : `side-${String.fromCharCode(97 + sideIndex)}`;
  const defaultCreatureIds = sideIndex === 0 ? [1, 2] : [4, 5];
  return {
    actorId: `${sideCode}-${participantIndex + 1}`,
    creatureId: defaultCreatureIds[participantIndex] ?? participantIndex + 1,
    level: 50,
    skillIds: [1],
  };
}

function createDefaultAction(index: number): SandboxActionForm {
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

function toSandboxRequest(
  values: BattleSandboxFormValues,
  state?: BattleSandboxStateSnapshot,
): BattleSandboxTurnRequest {
  const request: BattleSandboxTurnRequest = {
    formatCode: values.formatCode?.trim() ?? '',
    randomSeed: Number(values.randomSeed ?? 0),
    sides: (values.sides ?? []).map((side) => ({
      sideId: side.sideId?.trim() ?? '',
      activeActorIds: (side.activeActorIds ?? []).map((actorId) => actorId.trim()).filter(Boolean),
      participants: (side.participants ?? []).map((participant) => ({
        actorId: participant.actorId?.trim() ?? '',
        creatureId: Number(participant.creatureId),
        level: Number(participant.level),
        skillIds: (participant.skillIds ?? []).map(Number).filter(isFiniteNumber),
        abilityId: participant.abilityId,
        itemId: participant.itemId,
      })),
    })),
    actions: (values.actions ?? []).map((action) => ({
      type: action.type?.trim() ?? '',
      actorId: action.actorId?.trim() ?? '',
      skillId: action.type === 'USE_SKILL' ? action.skillId : undefined,
      targetActorId: action.targetActorId?.trim() ?? '',
    })),
  };
  if (state) {
    request.state = state;
  }
  return request;
}

function createActorOptions(sides: SandboxSideForm[] | undefined): ActorOption[] {
  return (sides ?? []).flatMap((side) => {
    const sideId = side.sideId?.trim() || '未命名队伍';
    return (side.participants ?? [])
      .map((participant) => participant.actorId?.trim())
      .filter((actorId): actorId is string => Boolean(actorId))
      .map((actorId) => ({
        label: `${actorId} / ${sideId}`,
        value: actorId,
      }));
  });
}

function createParticipantActorOptions(
  participants: SandboxParticipantForm[] | undefined,
): ActorOption[] {
  return (participants ?? [])
    .map((participant) => participant.actorId?.trim())
    .filter((actorId): actorId is string => Boolean(actorId))
    .map((actorId) => ({ label: actorId, value: actorId }));
}

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function renderActiveTag(active?: boolean) {
  return <Tag color={active ? 'blue' : 'default'}>{active ? '上场' : '后备'}</Tag>;
}

function renderEventType(type?: string) {
  const label = type ? (eventTypeLabels[type] ?? type) : '-';
  return <Tag color="geekblue">{label}</Tag>;
}

function renderResultDescription(result: BattleSandboxTurnResponse) {
  if (result.result) {
    return result.result.winningSideId
      ? `${result.result.winningSideId} 获胜：${result.result.reason}`
      : `战斗结束：${result.result.reason}`;
  }
  return result.resolved ? `第 ${result.turnNumber} 回合已结算。` : '请根据违规项调整行动。';
}

async function copySandboxState(state: BattleSandboxStateSnapshot) {
  try {
    await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    message.success('复盘 JSON 已复制');
  } catch {
    message.error('复制失败');
  }
}

function renderSandboxAction(action: BattleSandboxTurnRecord['actions'][number]) {
  if (action.type === 'SWITCH_PARTICIPANT') {
    return `${action.actorId} 替换为 ${action.targetActorId}`;
  }
  return `${action.actorId} 使用 ${action.skillId ?? '-'} -> ${action.targetActorId}`;
}

function participantRows(result: BattleSandboxTurnResponse): ParticipantRow[] {
  return result.sides.flatMap((side) =>
    side.participants.map((participant) => ({
      ...participant,
      sideId: side.sideId,
      key: `${side.sideId}-${participant.actorId}`,
    })),
  );
}

function eventRows(result: BattleSandboxTurnResponse): EventRow[] {
  return result.events.map((event, index) => ({
    ...event,
    key: `${event.turnNumber}-${event.type}-${index}`,
  }));
}

function violationKey(record: BattleActionViolationResponse): string {
  return [
    record.code,
    record.actorId,
    record.targetActorId ?? 'none',
    record.resourceId ?? 'none',
    record.message,
  ].join('-');
}

export default BattleSandboxPage;
