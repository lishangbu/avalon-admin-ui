import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type BattleFormatResponse = components['schemas']['BattleFormatResponse'];
export type BattleFormatClauseResponse = components['schemas']['BattleFormatClauseResponse'];
export type BattleFormatClauseBindingResponse =
  components['schemas']['BattleFormatClauseBindingResponse'];
export type BattleFormatRestrictionResponse =
  components['schemas']['BattleFormatRestrictionResponse'];
export type BattleSpecialMechanicResponse = components['schemas']['BattleSpecialMechanicResponse'];
export type BattleFormatSpecialMechanicResponse =
  components['schemas']['BattleFormatSpecialMechanicResponse'];
export type BattleStatusRuleResponse = components['schemas']['BattleStatusRuleResponse'];
export type BattleWeatherRuleResponse = components['schemas']['BattleWeatherRuleResponse'];
export type BattleTerrainRuleResponse = components['schemas']['BattleTerrainRuleResponse'];
export type BattleFieldRuleResponse = components['schemas']['BattleFieldRuleResponse'];
export type BattleSkillRuleResponse = components['schemas']['BattleSkillRuleResponse'];
export type BattleSkillStatusEffectResponse =
  components['schemas']['BattleSkillStatusEffectResponse'];
export type BattleSkillStatStageEffectResponse =
  components['schemas']['BattleSkillStatStageEffectResponse'];
export type BattleAbilityRuleResponse = components['schemas']['BattleAbilityRuleResponse'];
export type BattleItemRuleResponse = components['schemas']['BattleItemRuleResponse'];

export type BattleFormatRequest = components['schemas']['BattleFormatRequest'];
export type BattleFormatClauseRequest = components['schemas']['BattleFormatClauseRequest'];
export type BattleFormatClauseBindingRequest =
  components['schemas']['BattleFormatClauseBindingRequest'];
export type BattleFormatRestrictionRequest =
  components['schemas']['BattleFormatRestrictionRequest'];
export type BattleSpecialMechanicRequest = components['schemas']['BattleSpecialMechanicRequest'];
export type BattleFormatSpecialMechanicRequest =
  components['schemas']['BattleFormatSpecialMechanicRequest'];
export type BattleStatusRuleRequest = components['schemas']['BattleStatusRuleRequest'];
export type BattleWeatherRuleRequest = components['schemas']['BattleWeatherRuleRequest'];
export type BattleTerrainRuleRequest = components['schemas']['BattleTerrainRuleRequest'];
export type BattleFieldRuleRequest = components['schemas']['BattleFieldRuleRequest'];
export type BattleSkillRuleRequest = components['schemas']['BattleSkillRuleRequest'];
export type BattleSkillStatusEffectRequest =
  components['schemas']['BattleSkillStatusEffectRequest'];
export type BattleSkillStatStageEffectRequest =
  components['schemas']['BattleSkillStatStageEffectRequest'];
export type BattleAbilityRuleRequest = components['schemas']['BattleAbilityRuleRequest'];
export type BattleItemRuleRequest = components['schemas']['BattleItemRuleRequest'];

export type PageBattleFormatResponse = components['schemas']['PageBattleFormatResponse'];
export type PageBattleFormatClauseResponse =
  components['schemas']['PageBattleFormatClauseResponse'];
export type PageBattleFormatClauseBindingResponse =
  components['schemas']['PageBattleFormatClauseBindingResponse'];
export type PageBattleFormatRestrictionResponse =
  components['schemas']['PageBattleFormatRestrictionResponse'];
export type PageBattleSpecialMechanicResponse =
  components['schemas']['PageBattleSpecialMechanicResponse'];
export type PageBattleFormatSpecialMechanicResponse =
  components['schemas']['PageBattleFormatSpecialMechanicResponse'];
export type PageBattleStatusRuleResponse = components['schemas']['PageBattleStatusRuleResponse'];
export type PageBattleWeatherRuleResponse = components['schemas']['PageBattleWeatherRuleResponse'];
export type PageBattleTerrainRuleResponse = components['schemas']['PageBattleTerrainRuleResponse'];
export type PageBattleFieldRuleResponse = components['schemas']['PageBattleFieldRuleResponse'];
export type PageBattleSkillRuleResponse = components['schemas']['PageBattleSkillRuleResponse'];
export type PageBattleSkillStatusEffectResponse =
  components['schemas']['PageBattleSkillStatusEffectResponse'];
export type PageBattleSkillStatStageEffectResponse =
  components['schemas']['PageBattleSkillStatStageEffectResponse'];
export type PageBattleAbilityRuleResponse = components['schemas']['PageBattleAbilityRuleResponse'];
export type PageBattleItemRuleResponse = components['schemas']['PageBattleItemRuleResponse'];

export interface BattleRulePageQuery {
  page?: number;
  size?: number;
  q?: string;
}

export interface BattleFormatRestrictionListQuery extends BattleRulePageQuery {
  formatId?: number;
}

export interface BattleFormatClauseBindingListQuery {
  page?: number;
  size?: number;
  formatId?: number;
  clauseId?: number;
}

export interface BattleFormatSpecialMechanicListQuery {
  page?: number;
  size?: number;
  formatId?: number;
  mechanicId?: number;
}

export interface BattleSkillRuleListQuery extends BattleRulePageQuery {
  skillId?: number;
}

export interface BattleSkillStatusEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  statusRuleId?: number;
}

export interface BattleSkillStatStageEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  statId?: number;
}

export interface BattleAbilityRuleListQuery extends BattleRulePageQuery {
  abilityId?: number;
  triggerTiming?: string;
}

export interface BattleItemRuleListQuery extends BattleRulePageQuery {
  itemId?: number;
  triggerTiming?: string;
}

interface BattleRuleCrudApi<Response, Request, Page, Query> {
  list: (query: Query) => Promise<Page>;
  get: (id: number) => Promise<Response>;
  create: (body: Request) => Promise<Response>;
  update: (id: number, body: Request) => Promise<Response>;
  remove: (id: number) => Promise<void>;
}

function createCrudApi<Response, Request, Page, Query>(
  request: ApiRequest,
  path: `/api/battle-rules/${string}`,
): BattleRuleCrudApi<Response, Request, Page, Query> {
  return {
    list: (query: Query) =>
      request<Page>('GET', path, {
        params: { query: query as object },
      }),
    get: (id: number) =>
      request<Response>('GET', `${path}/{id}`, {
        params: { path: { id } },
      }),
    create: (body: Request) => request<Response>('POST', path, { body }),
    update: (id: number, body: Request) =>
      request<Response>('PUT', `${path}/{id}`, {
        params: { path: { id } },
        body,
      }),
    remove: (id: number) =>
      request<void>('DELETE', `${path}/{id}`, {
        params: { path: { id } },
      }),
  };
}

/**
 * 战斗规则资料 API。
 *
 * 每个资源都显式暴露自己的方法，页面层不传资源 key 拼 URL。`createCrudApi` 只收敛重复的
 * HTTP 调用样板，不表达任何业务资源模型。
 */
export function createBattleRulesServices(request: ApiRequest = apiRequest) {
  return {
    battleFormats: createCrudApi<
      BattleFormatResponse,
      BattleFormatRequest,
      PageBattleFormatResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/battle-formats'),
    formatClauses: createCrudApi<
      BattleFormatClauseResponse,
      BattleFormatClauseRequest,
      PageBattleFormatClauseResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/format-clauses'),
    formatClauseBindings: createCrudApi<
      BattleFormatClauseBindingResponse,
      BattleFormatClauseBindingRequest,
      PageBattleFormatClauseBindingResponse,
      BattleFormatClauseBindingListQuery
    >(request, '/api/battle-rules/format-clause-bindings'),
    formatRestrictions: createCrudApi<
      BattleFormatRestrictionResponse,
      BattleFormatRestrictionRequest,
      PageBattleFormatRestrictionResponse,
      BattleFormatRestrictionListQuery
    >(request, '/api/battle-rules/format-restrictions'),
    specialMechanics: createCrudApi<
      BattleSpecialMechanicResponse,
      BattleSpecialMechanicRequest,
      PageBattleSpecialMechanicResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/special-mechanics'),
    formatSpecialMechanics: createCrudApi<
      BattleFormatSpecialMechanicResponse,
      BattleFormatSpecialMechanicRequest,
      PageBattleFormatSpecialMechanicResponse,
      BattleFormatSpecialMechanicListQuery
    >(request, '/api/battle-rules/format-special-mechanics'),
    statusRules: createCrudApi<
      BattleStatusRuleResponse,
      BattleStatusRuleRequest,
      PageBattleStatusRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/status-rules'),
    weatherRules: createCrudApi<
      BattleWeatherRuleResponse,
      BattleWeatherRuleRequest,
      PageBattleWeatherRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/weather-rules'),
    terrainRules: createCrudApi<
      BattleTerrainRuleResponse,
      BattleTerrainRuleRequest,
      PageBattleTerrainRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/terrain-rules'),
    fieldRules: createCrudApi<
      BattleFieldRuleResponse,
      BattleFieldRuleRequest,
      PageBattleFieldRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/field-rules'),
    skillRules: createCrudApi<
      BattleSkillRuleResponse,
      BattleSkillRuleRequest,
      PageBattleSkillRuleResponse,
      BattleSkillRuleListQuery
    >(request, '/api/battle-rules/skill-rules'),
    skillStatusEffects: createCrudApi<
      BattleSkillStatusEffectResponse,
      BattleSkillStatusEffectRequest,
      PageBattleSkillStatusEffectResponse,
      BattleSkillStatusEffectListQuery
    >(request, '/api/battle-rules/skill-status-effects'),
    skillStatStageEffects: createCrudApi<
      BattleSkillStatStageEffectResponse,
      BattleSkillStatStageEffectRequest,
      PageBattleSkillStatStageEffectResponse,
      BattleSkillStatStageEffectListQuery
    >(request, '/api/battle-rules/skill-stat-stage-effects'),
    abilityRules: createCrudApi<
      BattleAbilityRuleResponse,
      BattleAbilityRuleRequest,
      PageBattleAbilityRuleResponse,
      BattleAbilityRuleListQuery
    >(request, '/api/battle-rules/ability-rules'),
    itemRules: createCrudApi<
      BattleItemRuleResponse,
      BattleItemRuleRequest,
      PageBattleItemRuleResponse,
      BattleItemRuleListQuery
    >(request, '/api/battle-rules/item-rules'),
  };
}

export const battleRulesServices = createBattleRulesServices();
