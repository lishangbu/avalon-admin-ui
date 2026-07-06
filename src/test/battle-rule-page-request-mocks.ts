import { vi } from 'vitest';
import { openApiClient } from '../services/client';

type PageRows = { rows: unknown[]; totalRowCount: number; page: number; size: number };

const page = (rows: unknown[]): PageRows => ({
  rows,
  totalRowCount: rows.length,
  page: 0,
  size: 100,
});

const battleFormat = {
  id: 1,
  code: 'standard-single',
  name: '标准单打',
  description: '标准单打测试资料',
  battleMode: 'SINGLE',
  playerCount: 2,
  teamSize: 6,
  activeParticipantCount: 1,
  defaultLevel: 50,
  allowCustomRules: true,
  enabled: true,
  sortOrder: 10,
};

const formatClause = {
  id: 2,
  code: 'species-unique',
  name: '种类唯一',
  clauseType: 'TEAM',
  description: '队伍中不能重复登记同一种类。',
  enabled: true,
  sortOrder: 20,
};

const specialMechanic = {
  id: 3,
  code: 'temporary-type-boost',
  name: '临时属性强化',
  description: '允许赛制启用临时强化机制。',
  enabled: true,
  sortOrder: 30,
};

const weatherRule = {
  id: 4,
  code: 'rain',
  name: '下雨',
  effectPolicy: 'weather-rain',
  defaultDurationTurns: 5,
  enabled: true,
  sortOrder: 40,
};

const terrainRule = {
  id: 5,
  code: 'electric-terrain',
  name: '电气场地',
  effectPolicy: 'terrain-electric',
  defaultDurationTurns: 5,
  enabled: true,
  sortOrder: 50,
};

const sideFieldRule = {
  id: 6,
  code: 'reflect',
  name: '反射壁',
  effectScope: 'SIDE',
  effectPolicy: 'side-reflect',
  minTurns: 5,
  maxTurns: 5,
  maxLayers: 1,
  enabled: true,
  sortOrder: 60,
};

const globalFieldRule = {
  id: 7,
  code: 'trick-room',
  name: '戏法空间',
  effectScope: 'FIELD',
  effectPolicy: 'field-trick-room',
  minTurns: 5,
  maxTurns: 5,
  maxLayers: 1,
  enabled: true,
  sortOrder: 70,
};

const statusRule = {
  id: 8,
  code: 'burn',
  name: '灼伤',
  statusKind: 'MAJOR',
  effectPolicy: 'major-burn',
  defaultDurationMin: 1,
  defaultDurationMax: 1,
  enabled: true,
  sortOrder: 80,
};

const skillRule = {
  id: 9,
  skillId: 85,
  effectPolicy: 'standard-damage',
  targetPolicy: 'selected-target',
  hitPolicy: 'standard-hit',
  damagePolicy: 'standard-damage',
  minHits: 1,
  maxHits: 1,
  criticalHitStage: 0,
  makesContact: false,
  affectedByProtect: true,
  protectsUser: false,
  enduresFatalDamage: false,
  thawsUserBeforeMove: false,
  weakenedByGrassyTerrain: false,
  chargesBeforeUse: false,
  rechargesAfterUse: false,
  soundBased: false,
  powderBased: false,
  punchBased: false,
  slicingBased: false,
  lockMoveTurnsMin: 1,
  lockMoveTurnsMax: 1,
  confusesUserAfterLock: false,
  forceTargetSwitch: false,
  enabled: true,
  sortOrder: 90,
};

const defaultPages: Record<string, PageRows> = {
  '/api/battle-rules/battle-formats': page([battleFormat]),
  '/api/battle-rules/format-clauses': page([formatClause]),
  '/api/battle-rules/format-clause-bindings': page([
    { id: 10, formatId: battleFormat.id, clauseId: formatClause.id, required: true, sortOrder: 10 },
  ]),
  '/api/battle-rules/format-restrictions': page([
    {
      id: 11,
      formatId: battleFormat.id,
      code: 'level-cap',
      name: '等级上限',
      restrictionType: 'LEVEL',
      restrictionOperator: 'LESS_THAN_OR_EQUAL',
      operandText: undefined,
      operandNumber: 50,
      description: '默认拉平到 50 级。',
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/special-mechanics': page([specialMechanic]),
  '/api/battle-rules/format-special-mechanics': page([
    {
      id: 12,
      formatId: battleFormat.id,
      mechanicId: specialMechanic.id,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/status-rules': page([statusRule]),
  '/api/battle-rules/weather-rules': page([weatherRule]),
  '/api/battle-rules/terrain-rules': page([terrainRule]),
  '/api/battle-rules/field-rules': page([sideFieldRule, globalFieldRule]),
  '/api/battle-rules/skill-rules': page([skillRule]),
  '/api/battle-rules/skill-status-effects': page([
    {
      id: 13,
      skillRuleId: skillRule.id,
      statusRuleId: statusRule.id,
      targetScope: 'TARGET',
      effectTiming: 'ON_HIT',
      chancePercent: 30,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-stat-stage-effects': page([
    {
      id: 14,
      skillRuleId: skillRule.id,
      statId: 2,
      targetScope: 'TARGET',
      effectTiming: 'ON_HIT',
      stageDelta: -1,
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-stat-stage-operations': page([
    {
      id: 15,
      skillRuleId: skillRule.id,
      statId: 2,
      operationKind: 'CLEAR',
      targetScope: 'TARGET',
      sourceScope: undefined,
      effectTiming: 'ON_HIT',
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-field-effects': page([
    {
      id: 16,
      skillRuleId: skillRule.id,
      fieldRuleId: sideFieldRule.id,
      targetSide: 'TARGET',
      effectTiming: 'ON_HIT',
      requiredWeatherRuleId: weatherRule.id,
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-global-field-effects': page([
    {
      id: 17,
      skillRuleId: skillRule.id,
      fieldRuleId: globalFieldRule.id,
      effectTiming: 'ON_HIT',
      requiredWeatherRuleId: weatherRule.id,
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-weather-accuracy-overrides': page([
    {
      id: 18,
      skillRuleId: skillRule.id,
      weatherRuleId: weatherRule.id,
      accuracyPercent: undefined,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-weather-power-modifiers': page([
    {
      id: 19,
      skillRuleId: skillRule.id,
      weatherRuleId: weatherRule.id,
      powerMultiplier: 1.5,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-weather-element-overrides': page([
    {
      id: 20,
      skillRuleId: skillRule.id,
      weatherRuleId: weatherRule.id,
      targetElementId: 10,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-terrain-power-modifiers': page([
    {
      id: 21,
      skillRuleId: skillRule.id,
      terrainRuleId: terrainRule.id,
      powerMultiplier: 1.3,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-terrain-element-overrides': page([
    {
      id: 22,
      skillRuleId: skillRule.id,
      terrainRuleId: terrainRule.id,
      targetElementId: 10,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/battle-rules/skill-charge-skip-weathers': page([
    {
      id: 23,
      skillRuleId: skillRule.id,
      weatherRuleId: weatherRule.id,
      enabled: true,
      sortOrder: 10,
    },
  ]),
  '/api/game-data/skills': page([{ id: 85, code: 'thunderbolt', name: '十万伏特' }]),
  '/api/game-data/elements': page([{ id: 10, code: 'electric', name: '电' }]),
  '/api/game-data/stats': page([{ id: 2, code: 'attack', name: '攻击' }]),
};

/**
 * 战斗规则页面 smoke 测试的统一请求夹具。
 *
 * 这里拦截底层 openapi-fetch，而不是逐页 mock service。这样页面仍会走真实 service URL，
 * 一旦某个页面改错 endpoint 或引用选项没有转成中文，测试会直接失败。
 */
export function mockBattleRulePageRequests(overrides: Record<string, PageRows> = {}) {
  vi.restoreAllMocks();
  const pages = { ...defaultPages, ...overrides };

  return vi.spyOn(openApiClient, 'request').mockImplementation((async (
    method: string,
    path: string,
  ) => ({
    data: method === 'get' ? (pages[path] ?? page([])) : {},
    response: new Response(null, { status: method === 'delete' ? 204 : 200 }),
  })) as never);
}
