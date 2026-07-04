import { ReloadOutlined } from '@ant-design/icons';
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
  type BattleSandboxEvent,
  type BattleSandboxParticipant,
  type BattleSandboxRandomTrace,
  type BattleSandboxTurnRequest,
  type BattleSandboxTurnResponse,
  type BattleActionViolationResponse,
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
  sideId?: string;
  actorId?: string;
  creatureId?: number;
  level?: number;
  skillId?: number;
  abilityId?: number;
  itemId?: number;
}

interface BattleSandboxFormValues {
  formatCode?: string;
  randomSeed?: number;
  left?: SandboxParticipantForm;
  right?: SandboxParticipantForm;
}

interface ParticipantRow extends BattleSandboxParticipant {
  key: string;
  sideId: string;
}

interface EventRow extends BattleSandboxEvent {
  key: string;
}

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
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const initialValues = useMemo(() => createDefaultValues(), []);

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
      battleSandboxService.resolveTurn(toSandboxRequest(values)),
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
            选择双方精灵和技能，按当前规则结算一回合。
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

          <div className="grid gap-3 lg:grid-cols-2">
            <ParticipantPanel name="left" title="左侧队伍" options={options} />
            <ParticipantPanel name="right" title="右侧队伍" options={options} />
          </div>

          <Space className="mt-4">
            <Button type="primary" htmlType="submit" loading={resolveMutation.isPending}>
              结算回合
            </Button>
            <Button onClick={() => setResult(null)}>清空结果</Button>
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
          </div>
        </Card>
      ) : null}
    </div>
  );

  function resetForm() {
    form.setFieldsValue(createDefaultValues());
    setResult(null);
  }
}

function ParticipantPanel({
  name,
  title,
  options,
}: {
  name: 'left' | 'right';
  title: string;
  options: ReturnType<typeof useBattleRuleOptions>;
}) {
  return (
    <div className="rounded border border-solid border-gray-200 p-3">
      <Typography.Title level={5} className="!mb-3">
        {title}
      </Typography.Title>

      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item name={[name, 'sideId']} label="队伍侧编号" rules={requiredRule}>
          <Input placeholder="side-a" />
        </Form.Item>
        <Form.Item name={[name, 'actorId']} label="成员编号" rules={requiredRule}>
          <Input placeholder="side-a-1" />
        </Form.Item>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item name={[name, 'creatureId']} label="精灵" rules={requiredSelectRule}>
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            options={options.creatureOptions}
            loading={options.loading}
            placeholder="选择精灵"
          />
        </Form.Item>
        <Form.Item name={[name, 'level']} label="等级" rules={requiredRule}>
          <InputNumber min={1} max={100} className="w-full" />
        </Form.Item>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Form.Item name={[name, 'skillId']} label="行动技能" rules={requiredSelectRule}>
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            options={options.skillOptions}
            loading={options.loading}
            placeholder="选择技能"
          />
        </Form.Item>
        <Form.Item name={[name, 'abilityId']} label="特性">
          <Select
            allowClear
            showSearch={{ optionFilterProp: 'label' }}
            options={options.abilityOptions}
            loading={options.loading}
            placeholder="可选"
          />
        </Form.Item>
        <Form.Item name={[name, 'itemId']} label="道具">
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
    left: {
      sideId: 'side-a',
      actorId: 'side-a-1',
      creatureId: 1,
      level: 50,
      skillId: 1,
    },
    right: {
      sideId: 'side-b',
      actorId: 'side-b-1',
      creatureId: 4,
      level: 50,
      skillId: 1,
    },
  };
}

function toSandboxRequest(values: BattleSandboxFormValues): BattleSandboxTurnRequest {
  const left = normalizeParticipant(values.left, 'side-a', 'side-a-1');
  const right = normalizeParticipant(values.right, 'side-b', 'side-b-1');

  return {
    formatCode: values.formatCode?.trim() ?? '',
    randomSeed: Number(values.randomSeed ?? 0),
    sides: [left, right].map((side) => ({
      sideId: side.sideId,
      activeActorIds: [side.actorId],
      participants: [
        {
          actorId: side.actorId,
          creatureId: Number(side.creatureId),
          level: Number(side.level),
          skillIds: [Number(side.skillId)],
          abilityId: side.abilityId,
          itemId: side.itemId,
        },
      ],
    })),
    actions: [
      {
        type: 'USE_SKILL',
        actorId: left.actorId,
        skillId: Number(left.skillId),
        targetActorId: right.actorId,
      },
      {
        type: 'USE_SKILL',
        actorId: right.actorId,
        skillId: Number(right.skillId),
        targetActorId: left.actorId,
      },
    ],
  };
}

function normalizeParticipant(
  value: SandboxParticipantForm | undefined,
  sideId: string,
  actorId: string,
): Required<
  Pick<SandboxParticipantForm, 'sideId' | 'actorId' | 'creatureId' | 'level' | 'skillId'>
> &
  Pick<SandboxParticipantForm, 'abilityId' | 'itemId'> {
  return {
    sideId: value?.sideId?.trim() || sideId,
    actorId: value?.actorId?.trim() || actorId,
    creatureId: Number(value?.creatureId),
    level: Number(value?.level),
    skillId: Number(value?.skillId),
    abilityId: value?.abilityId,
    itemId: value?.itemId,
  };
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
