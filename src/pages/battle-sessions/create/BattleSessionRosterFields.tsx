import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Select, Typography } from 'antd';
import type { BattleSessionCreateRequest } from '../../../services/battle-sessions';
import {
  ParticipantStatConfigFields,
  createDefaultParticipantStatConfig,
} from '../../battle-rules/shared/participant-stat-config-fields';

interface SelectOption {
  label: string;
  value: string;
}

export interface BattleSessionRosterOptions {
  formatOptions: SelectOption[];
  creatureOptions: SelectOption[];
  skillOptions: SelectOption[];
  abilityOptions: SelectOption[];
  itemOptions: SelectOption[];
}

export type BattleSessionCreateFormValues = BattleSessionCreateRequest;
export type BattleSessionRosterSideForm = NonNullable<BattleSessionCreateRequest['sides']>[number];
export type BattleSessionRosterParticipantForm = NonNullable<
  BattleSessionRosterSideForm['participants']
>[number];

const requiredRule = [{ required: true, message: '请填写该字段' }];
const requiredSelectRule = [{ required: true, message: '请选择该字段' }];
const requiredArrayRule = [
  { required: true, type: 'array' as const, min: 1, message: '请选择至少一项' },
];

/** 创建不包含 randomSeed、sideId、actorId 或运行态的默认 Session Roster。 */
export function createDefaultBattleSessionFormValues(): BattleSessionCreateFormValues {
  return {
    formatCode: 'standard-single',
    sides: [createDefaultSide(0), createDefaultSide(1)],
  };
}

/**
 * 收集服务端允许客户端提交的 Session Roster 字段。
 *
 * sideId 与 actorId 由后端根据固定阵容顺序生成；该组件刻意不提供这两个字段，也不复用会暴露
 * randomSeed 和状态快照的沙盒表单。
 */
export function BattleSessionRosterFields({
  options,
  loading = false,
}: {
  options: BattleSessionRosterOptions;
  loading?: boolean;
}) {
  const sides = Form.useWatch('sides') as BattleSessionRosterSideForm[] | undefined;

  return (
    <div className="space-y-4">
      <Form.Item name="formatCode" label="战斗赛制" rules={requiredSelectRule}>
        <Select
          showSearch={{ optionFilterProp: 'label' }}
          options={options.formatOptions}
          loading={loading}
          placeholder="选择赛制"
        />
      </Form.Item>

      <Form.List name="sides">
        {(sideFields) => (
          <div className="grid gap-4 xl:grid-cols-2">
            {sideFields.map((sideField, sideIndex) => (
              <RosterSideFields
                key={sideField.key}
                sideName={sideField.name}
                sideIndex={sideIndex}
                participantCount={sides?.[sideIndex]?.participants?.length ?? 0}
                options={options}
                loading={loading}
              />
            ))}
          </div>
        )}
      </Form.List>
    </div>
  );
}

function RosterSideFields({
  sideName,
  sideIndex,
  participantCount,
  options,
  loading,
}: {
  sideName: number;
  sideIndex: number;
  participantCount: number;
  options: BattleSessionRosterOptions;
  loading: boolean;
}) {
  const sideTitle = sideIndex === 0 ? '甲方阵容' : '乙方阵容';
  const activeOptions = Array.from({ length: participantCount }, (_, index) => ({
    label: `成员 ${index + 1}`,
    value: index,
  }));

  return (
    <section className="rounded border border-solid border-gray-200 p-3">
      <Typography.Title level={4}>{sideTitle}</Typography.Title>
      <Form.Item
        name={[sideName, 'activeParticipantIndexes']}
        label="初始上场成员"
        rules={requiredArrayRule}
      >
        <Select
          mode="multiple"
          options={activeOptions}
          maxTagCount="responsive"
          placeholder="选择初始上场成员"
        />
      </Form.Item>

      <Form.List name={[sideName, 'participants']}>
        {(participantFields, participantOperations) => (
          <div className="space-y-3">
            {participantFields.map((participantField, participantIndex) => (
              <div
                key={participantField.key}
                className="rounded border border-dashed border-gray-200 p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
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

                <div className="grid gap-3 md:grid-cols-2">
                  <Form.Item
                    name={[participantField.name, 'creatureId']}
                    label="精灵"
                    rules={requiredSelectRule}
                  >
                    <Select
                      showSearch={{ optionFilterProp: 'label' }}
                      options={options.creatureOptions}
                      loading={loading}
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
                      options={options.skillOptions}
                      loading={loading}
                      maxTagCount="responsive"
                      placeholder="选择技能"
                    />
                  </Form.Item>
                  <Form.Item name={[participantField.name, 'abilityId']} label="特性">
                    <Select
                      allowClear
                      showSearch={{ optionFilterProp: 'label' }}
                      options={options.abilityOptions}
                      loading={loading}
                      placeholder="可选"
                    />
                  </Form.Item>
                  <Form.Item name={[participantField.name, 'itemId']} label="道具">
                    <Select
                      allowClear
                      showSearch={{ optionFilterProp: 'label' }}
                      options={options.itemOptions}
                      loading={loading}
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
    </section>
  );
}

function createDefaultSide(sideIndex: number): BattleSessionRosterSideForm {
  return {
    activeParticipantIndexes: [0],
    participants: [createDefaultParticipant(sideIndex, 0), createDefaultParticipant(sideIndex, 1)],
  };
}

function createDefaultParticipant(
  sideIndex: number,
  participantIndex: number,
): BattleSessionRosterParticipantForm {
  const defaultCreatureIds = sideIndex === 0 ? ['1', '2'] : ['4', '5'];
  return {
    creatureId: defaultCreatureIds[participantIndex] ?? '1',
    level: 50,
    skillIds: ['1'],
    ...createDefaultParticipantStatConfig(),
  };
}
