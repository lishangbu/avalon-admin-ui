export type ParticipantNatureStatCode =
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export interface ParticipantStatConfigForm {
  individualValues?: Record<string, number>;
  effortValues?: Record<string, number>;
  natureIncreasedStat?: ParticipantNatureStatCode;
  natureDecreasedStat?: ParticipantNatureStatCode;
}

export interface ParticipantStatConfigRequest {
  individualValues: Record<string, number>;
  effortValues: Record<string, number>;
  natureIncreasedStat?: ParticipantNatureStatCode;
  natureDecreasedStat?: ParticipantNatureStatCode;
}

export const battleStatDefinitions = [
  { code: 'hp', label: 'HP' },
  { code: 'attack', label: '攻击' },
  { code: 'defense', label: '防御' },
  { code: 'special-attack', label: '特攻' },
  { code: 'special-defense', label: '特防' },
  { code: 'speed', label: '速度' },
] as const;

export const natureStatOptions = battleStatDefinitions
  .filter((stat) => stat.code !== 'hp')
  .map((stat) => ({ label: stat.label, value: stat.code }));

/**
 * 创建前端样例成员的默认能力配置。
 *
 * 后端允许省略单项能力并在服务端补默认值，但前端样例表单需要可见、可编辑、可复位。因此这里显式写满 6 项个体值
 * 和 6 项努力值：用户打开页面时看到的数值，就是请求里实际会提交的数值，不需要猜“空值到底代表什么”。
 */
export function createDefaultParticipantStatConfig(): ParticipantStatConfigForm {
  return {
    individualValues: createStatMap(31),
    effortValues: createStatMap(0),
  };
}

/**
 * 把表单里的能力配置归一化成后端 DTO 需要的请求片段。
 *
 * Ant Design 的 `InputNumber` 在用户清空字段时会给出 `null/undefined`，而后端需要稳定整数 map。这里将空值恢复为
 * 现代默认：个体值 31、努力值 0；性格字段保持可选，让后端继续负责“必须成对填写、不能影响 HP、不能相同”的
 * 业务校验，避免前端和后端维护两套规则。
 */
export function toParticipantStatConfigRequest(
  participant: ParticipantStatConfigForm,
): ParticipantStatConfigRequest {
  return {
    individualValues: normalizeStatMap(participant.individualValues, 31),
    effortValues: normalizeStatMap(participant.effortValues, 0),
    natureIncreasedStat: participant.natureIncreasedStat,
    natureDecreasedStat: participant.natureDecreasedStat,
  };
}

function createStatMap(defaultValue: number): Record<string, number> {
  return Object.fromEntries(battleStatDefinitions.map((stat) => [stat.code, defaultValue]));
}

function normalizeStatMap(
  values: Record<string, number> | undefined,
  defaultValue: number,
): Record<string, number> {
  return Object.fromEntries(
    battleStatDefinitions.map((stat) => {
      const value = Number(values?.[stat.code]);
      return [stat.code, Number.isFinite(value) ? value : defaultValue];
    }),
  );
}
