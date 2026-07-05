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
import {
  createDefaultParticipantStatConfig,
  ParticipantStatConfigFields,
  type ParticipantStatConfigForm,
  toParticipantStatConfigRequest,
} from '../battle-rules/shared/participant-stat-config-fields';
import { useBattleRuleOptions } from '../battle-rules/shared/useBattleRuleOptions';

interface SandboxParticipantForm extends ParticipantStatConfigForm {
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

type SandboxStateParticipant = BattleSandboxStateSnapshot['sides'][number]['participants'][number];

interface ParticipantRow extends BattleSandboxParticipant {
  key: string;
  sideId: string;
  state?: SandboxStateParticipant;
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
  AccuracyLockStarted: '命中锁定',
  SkillPpReduced: '技能 PP 扣减',
  SkillMissed: '技能未命中',
  SkillFailed: '技能失败',
  ProtectionStarted: '保护开始',
  ProtectionFailed: '保护失败',
  SkillBlockedByProtection: '保护阻挡',
  SkillBlockedByTerrain: '场地阻挡',
  SkillBlockedByAbility: '特性阻挡',
  SkillBlockedByElement: '属性无效',
  SkillAbsorbedByAbility: '特性吸收',
  ParticipantElementsChanged: '属性变化',
  MultiHitCountDetermined: '连击次数',
  LockedMoveStarted: '锁招开始',
  LockedMoveAdvanced: '锁招推进',
  LockedMoveEnded: '锁招结束',
  SkillPrevented: '技能受阻',
  SkillDisabled: '定身',
  BindingDamageApplied: '束缚伤害',
  LeechSeedPlanted: '寄生种子',
  LeechSeedDamageApplied: '寄生伤害',
  LeechSeedCleared: '寄生解除',
  DamageApplied: '造成伤害',
  StatusApplied: '状态施加',
  StatusApplicationBlocked: '状态阻挡',
  StatusCleared: '状态解除',
  VolatileStatusApplied: '临时状态施加',
  VolatileStatusApplicationBlocked: '临时状态阻挡',
  VolatileStatusCleared: '临时状态解除',
  StatStageChanged: '能力变化',
  WeightReductionChanged: '体重变化',
  StatStageCleared: '能力清除',
  StatStageCopied: '能力复制',
  StatStageSwapped: '能力交换',
  StatStageInverted: '能力反转',
  SideDamageReductionStarted: '屏障开始',
  SideProtectionStarted: '一侧防护开始',
  SideProtectionsRemoved: '防护移除',
  SideSpeedModifierStarted: '速度修正开始',
  SideEntryHazardChanged: '入场陷阱变化',
  SideEntryHazardRemoved: '入场陷阱移除',
  EntryHazardDamageApplied: '入场伤害',
  EntryHazardStatusApplied: '入场状态',
  EntryHazardStatusApplicationBlocked: '入场状态阻挡',
  EntryHazardStatStageChanged: '入场能力变化',
  FieldSpeedOrderStarted: '场地速度顺序开始',
  FieldSpeedOrderEnded: '场地速度顺序结束',
  ResidualDamageApplied: '回合末伤害',
  RecoilDamageApplied: '反作用伤害',
  ConfusionDamageApplied: '混乱伤害',
  HealingApplied: '体力回复',
  LeechSeedHealingApplied: '寄生回复',
  SkillHealingApplied: '技能回复',
  SkillRecoilDamageApplied: '技能反作用伤害',
  SkillSelfSacrificeDamageApplied: '自损伤害',
  HpAveragedBySkill: '体力平均',
  FatalDamageSurvived: '濒死保留',
  DamageReducedByItem: '道具减伤',
  SubstituteStarted: '替身开始',
  SubstituteDamageApplied: '替身受伤',
  SubstituteBroken: '替身破坏',
  SubstituteCleared: '替身清除',
  RechargeStarted: '休整开始',
  SkillChargeStarted: '蓄力开始',
  SkillChargeSkippedByItem: '道具跳过蓄力',
  SkillChargeReleased: '蓄力释放',
  SkillChargeInterrupted: '蓄力中断',
  TerrainHealingApplied: '场地回复',
  WeatherDamageApplied: '天气伤害',
  WeatherHealingApplied: '天气回复',
  WeatherStarted: '天气开始',
  WeatherEnded: '天气结束',
  TerrainStarted: '场地开始',
  TerrainEnded: '场地结束',
  ParticipantFainted: '精灵倒下',
  ParticipantSwitched: '替换精灵',
  TargetForcedSwitchSelected: '强制替换目标',
  SwitchPrevented: '替换受阻',
  TurnEnded: '回合结束',
  BattleEnded: '战斗结束',
};

export function BattleSandboxPage() {
  const [form] = Form.useForm<BattleSandboxFormValues>();
  const [result, setResult] = useState<BattleSandboxTurnResponse | null>(null);
  // 沙盒结算失败通常不是普通网络抖动，而是后端对客户端携带的战斗状态快照做了强校验。
  // 这类错误需要稳定留在页面上，方便排查是哪一个 state/行动/成员违反了运行时不变量；
  // 只用 message toast 会在几秒后消失，生产环境复盘时很容易丢掉真正的失败原因。
  const [sandboxError, setSandboxError] = useState<string | null>(null);
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
        title: '临时状态',
        width: 260,
        render: (_, record) => renderParticipantRuntimeTags(record.state),
      },
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
      setSandboxError(null);
      setResult(response);
      message.success(response.resolved ? '回合结算完成' : '行动校验未通过');
    },
    onError: (error) => {
      const errorMessage = apiErrorMessage(error, '沙盒结算失败');
      setSandboxError(errorMessage);
      message.error(errorMessage);
    },
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
            <Button disabled={!result} onClick={restartBattle}>
              重开战斗
            </Button>
          </Space>
        </Form>
      </Card>

      {sandboxError ? (
        <Alert showIcon type="error" title="沙盒结算失败" description={sandboxError} />
      ) : null}

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
    setSandboxError(null);
  }

  function clearResultWhenSetupChanges(changedValues: Partial<BattleSandboxFormValues>) {
    if ('formatCode' in changedValues || 'sides' in changedValues) {
      setResult(null);
      setSandboxError(null);
    }
  }

  function restartBattle() {
    setResult(null);
    setSandboxError(null);
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
                          <ParticipantStatConfigFields participantName={participantField.name} />
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
    ...createDefaultParticipantStatConfig(),
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
        ...toParticipantStatConfigRequest(participant),
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

function renderParticipantRuntimeTags(state?: SandboxStateParticipant) {
  const tags = participantRuntimeTags(state);
  if (tags.length === 0) {
    return '-';
  }
  return (
    <Space size={[0, 4]} wrap>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </Space>
  );
}

function participantRuntimeTags(state?: SandboxStateParticipant): string[] {
  if (!state) {
    return [];
  }
  const tags: string[] = [];
  if (state.accuracyLockTargetActorId && state.accuracyLockTurnsRemaining > 0) {
    tags.push(`命中锁定 ${state.accuracyLockTargetActorId}（${state.accuracyLockTurnsRemaining}）`);
  }
  if (state.lockedMoveSkillId && state.lockedMoveTurnsRemaining > 0) {
    tags.push(`锁招 ${state.lockedMoveSkillId}（${state.lockedMoveTurnsRemaining}）`);
  }
  if (state.choiceLockedSkillId) {
    tags.push(`讲究锁定 ${state.choiceLockedSkillId}`);
  }
  if (state.chargingTurnsRemaining > 0) {
    tags.push(`蓄力 ${state.chargingSkillId ?? '-'}（${state.chargingTurnsRemaining}）`);
  }
  if (state.rechargeTurnsRemaining > 0) {
    tags.push(`休整（${state.rechargeTurnsRemaining}）`);
  }
  if (state.confusionTurnsRemaining > 0) {
    tags.push(`混乱（${state.confusionTurnsRemaining}）`);
  }
  if (state.healBlockTurnsRemaining > 0) {
    tags.push(`回复封锁（${state.healBlockTurnsRemaining}）`);
  }
  if (state.tauntTurnsRemaining > 0) {
    tags.push(`挑衅（${state.tauntTurnsRemaining}）`);
  }
  if (state.disabledSkillId && state.disabledSkillTurnsRemaining > 0) {
    tags.push(`定身 ${state.disabledSkillId}（${state.disabledSkillTurnsRemaining}）`);
  }
  if (state.tormented) {
    tags.push('无理取闹');
  }
  if (state.boundByActorId && state.bindingTurnsRemaining > 0) {
    tags.push(`束缚 ${state.boundByActorId}（${state.bindingTurnsRemaining}）`);
  }
  if (state.substituteHp > 0) {
    tags.push(`替身 ${state.substituteHp}`);
  }
  return tags;
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
  const statesByActorId = new Map(
    result.state.sides.flatMap((side) =>
      side.participants.map((participant) => [participant.actorId, participant] as const),
    ),
  );
  return result.sides.flatMap((side) =>
    side.participants.map((participant) => ({
      ...participant,
      sideId: side.sideId,
      state: statesByActorId.get(participant.actorId),
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
