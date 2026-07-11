import { Button, Empty, Radio, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import type {
  BattleSessionResponse,
  BattleSessionTurnCommandRequest,
} from '../../../services/battle-sessions';

type BattleActionRequest = NonNullable<BattleSessionTurnCommandRequest['actions']>[number];
type BattleSessionTurnRequirement = BattleSessionResponse['turnRequirements'][number];

export interface BattleSessionTurnRequirementsProps {
  pending?: boolean;
  requirements: BattleSessionResponse['turnRequirements'];
  revision: number;
  onSubmit: (actions: BattleActionRequest[]) => void;
}

/**
 * 按后端 Turn Requirements 收集一个完整回合。
 *
 * 每个单选项都是后端提供的完整 BattleActionRequest；前端只让维护人员选中其中一项，不自行组合
 * actor、技能或目标，也不复制战斗合法性规则。
 */
export function BattleSessionTurnRequirements({
  pending = false,
  requirements,
  revision,
  onSubmit,
}: BattleSessionTurnRequirementsProps) {
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    setSelectedOptionIndexes({});
  }, [revision]);

  if (requirements.length === 0) {
    return (
      <div className="space-y-3">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前无需人工选择行动" />
        <Button type="primary" loading={pending} onClick={() => onSubmit([])}>
          推进自动回合
        </Button>
      </div>
    );
  }

  const complete = requirements.every(
    (requirement) => selectedOptionIndexes[requirement.actorId] !== undefined,
  );

  function submitCompleteTurn() {
    const actions = collectSelectedActions(requirements, selectedOptionIndexes);
    if (!actions) {
      return;
    }
    onSubmit(actions);
  }

  return (
    <div className="space-y-4">
      {requirements.map((requirement) => (
        <div key={requirement.actorId} className="rounded border border-solid border-gray-200 p-3">
          <Typography.Text strong>{requirement.actorId}</Typography.Text>
          <Radio.Group
            className="mt-2 block"
            value={selectedOptionIndexes[requirement.actorId]}
            onChange={(event) =>
              setSelectedOptionIndexes((current) => ({
                ...current,
                [requirement.actorId]: Number(event.target.value),
              }))
            }
          >
            <Space orientation="vertical">
              {requirement.options.map((option, optionIndex) => (
                <Radio key={actionKey(option, optionIndex)} value={optionIndex}>
                  {renderActionLabel(option)}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      ))}

      <Button type="primary" disabled={!complete} loading={pending} onClick={submitCompleteTurn}>
        提交完整回合
      </Button>
    </div>
  );
}

function collectSelectedActions(
  requirements: BattleSessionTurnRequirement[],
  selectedOptionIndexes: Record<string, number>,
): BattleActionRequest[] | undefined {
  const actions: BattleActionRequest[] = [];
  for (const requirement of requirements) {
    const selectedIndex = selectedOptionIndexes[requirement.actorId];
    if (selectedIndex === undefined) {
      return undefined;
    }
    const action = requirement.options[selectedIndex];
    if (!action) {
      return undefined;
    }
    actions.push(action);
  }
  return actions;
}

function renderActionLabel(action: BattleActionRequest): string {
  if (action.type === 'USE_SKILL') {
    return `${action.actorId} 使用技能 ${action.skillId ?? '-'}，目标 ${action.targetActorId}`;
  }
  if (action.type === 'SWITCH_PARTICIPANT') {
    return `${action.actorId} 替换为 ${action.targetActorId}`;
  }
  return `${action.actorId} 执行 ${action.type}，目标 ${action.targetActorId}`;
}

function actionKey(action: BattleActionRequest, optionIndex: number): string {
  return [
    action.type,
    action.actorId,
    action.skillId ?? 'none',
    action.targetActorId,
    optionIndex,
  ].join('-');
}
