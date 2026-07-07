import type {
  BattleSandboxStateSnapshot,
  BattleSandboxTurnRequest,
} from '../../services/battle-sandbox';
import {
  createDefaultParticipantStatConfig,
  toParticipantStatConfigRequest,
  type ParticipantStatConfigForm,
} from '../battle-rules/shared/participant-stat-config';

export interface SandboxParticipantForm extends ParticipantStatConfigForm {
  actorId?: string;
  creatureId?: number;
  level?: number;
  skillIds?: number[];
  abilityId?: number;
  itemId?: number;
}

export interface SandboxSideForm {
  sideId?: string;
  activeActorIds?: string[];
  participants?: SandboxParticipantForm[];
}

export interface SandboxActionForm {
  type?: string;
  actorId?: string;
  skillId?: number;
  targetActorId?: string;
}

export interface BattleSandboxFormValues {
  formatCode?: string;
  randomSeed?: number;
  sides?: SandboxSideForm[];
  actions?: SandboxActionForm[];
}

/**
 * 创建战斗沙盒首屏样例。
 *
 * 沙盒页面本身负责展示复杂表单和结果表格，但“默认双方、默认行动、默认能力值”是请求契约的一部分。
 * 把它放在纯 TypeScript 模块里，可以让单元测试不加载 Ant Design，也能确保 Playwright 与页面运行时使用同一份默认数据。
 */
export function createDefaultValues(): BattleSandboxFormValues {
  return {
    formatCode: 'standard-single',
    randomSeed: 0,
    sides: [createDefaultSide(0), createDefaultSide(1)],
    actions: [createDefaultAction(0), createDefaultAction(1)],
  };
}

/**
 * 把页面表单值转换成后端回合结算请求。
 *
 * 这里刻意只做机械归一化：修剪文本、过滤非法技能 ID、切换行动不提交 skillId、继续结算时携带上一回合 state。
 * 赛制人数、行动合法性、能力值范围等业务规则仍由后端战斗引擎校验，避免前端复制一套会漂移的规则实现。
 */
export function toSandboxRequest(
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
      skillId: action.type?.trim() === 'USE_SKILL' ? action.skillId : undefined,
      targetActorId: action.targetActorId?.trim() ?? '',
    })),
  };
  if (state) {
    request.state = state;
  }
  return request;
}

export function createDefaultSide(index: number): SandboxSideForm {
  const sideCode = index === 0 ? 'side-a' : `side-${String.fromCharCode(97 + index)}`;
  return {
    sideId: sideCode,
    activeActorIds: [`${sideCode}-1`],
    participants: [createDefaultParticipant(index, 0), createDefaultParticipant(index, 1)],
  };
}

export function createDefaultParticipant(
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

export function createDefaultAction(index: number): SandboxActionForm {
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

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}
