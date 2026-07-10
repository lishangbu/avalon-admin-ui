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
export type BattleSkillStatStageOperationResponse =
  components['schemas']['BattleSkillStatStageOperationResponse'];
export type BattleSkillFieldEffectResponse =
  components['schemas']['BattleSkillFieldEffectResponse'];
export type BattleSkillGlobalFieldEffectResponse =
  components['schemas']['BattleSkillGlobalFieldEffectResponse'];
export type BattleSkillWeatherAccuracyOverrideResponse =
  components['schemas']['BattleSkillWeatherAccuracyOverrideResponse'];
export type BattleSkillWeatherPowerModifierResponse =
  components['schemas']['BattleSkillWeatherPowerModifierResponse'];
export type BattleSkillWeatherElementOverrideResponse =
  components['schemas']['BattleSkillWeatherElementOverrideResponse'];
export type BattleSkillTerrainPowerModifierResponse =
  components['schemas']['BattleSkillTerrainPowerModifierResponse'];
export type BattleSkillTerrainElementOverrideResponse =
  components['schemas']['BattleSkillTerrainElementOverrideResponse'];
export type BattleSkillChargeSkipWeatherResponse =
  components['schemas']['BattleSkillChargeSkipWeatherResponse'];
export type BattleAbilityRuleResponse = components['schemas']['BattleAbilityRuleResponse'];
export type BattleItemRuleResponse = components['schemas']['BattleItemRuleResponse'];
export type BattleRuntimeSnapshot = components['schemas']['BattleRuntimeSnapshot'];
export type BattlePreparationValidationResponse =
  components['schemas']['BattlePreparationValidationResponse'];
export type BattleActionValidationResponse =
  components['schemas']['BattleActionValidationResponse'];
export type BattleActionViolationResponse = components['schemas']['BattleActionViolationResponse'];

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
export type BattleSkillStatStageOperationRequest =
  components['schemas']['BattleSkillStatStageOperationRequest'];
export type BattleSkillFieldEffectRequest = components['schemas']['BattleSkillFieldEffectRequest'];
export type BattleSkillGlobalFieldEffectRequest =
  components['schemas']['BattleSkillGlobalFieldEffectRequest'];
export type BattleSkillWeatherAccuracyOverrideRequest =
  components['schemas']['BattleSkillWeatherAccuracyOverrideRequest'];
export type BattleSkillWeatherPowerModifierRequest =
  components['schemas']['BattleSkillWeatherPowerModifierRequest'];
export type BattleSkillWeatherElementOverrideRequest =
  components['schemas']['BattleSkillWeatherElementOverrideRequest'];
export type BattleSkillTerrainPowerModifierRequest =
  components['schemas']['BattleSkillTerrainPowerModifierRequest'];
export type BattleSkillTerrainElementOverrideRequest =
  components['schemas']['BattleSkillTerrainElementOverrideRequest'];
export type BattleSkillChargeSkipWeatherRequest =
  components['schemas']['BattleSkillChargeSkipWeatherRequest'];
export type BattleAbilityRuleRequest = components['schemas']['BattleAbilityRuleRequest'];
export type BattleItemRuleRequest = components['schemas']['BattleItemRuleRequest'];
export type BattlePreparationValidationRequest =
  components['schemas']['BattlePreparationValidationRequest'];
export type BattleActionValidationRequest = components['schemas']['BattleActionValidationRequest'];
export type BattleActionRequest = components['schemas']['BattleActionRequest'];

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
export type PageBattleSkillStatStageOperationResponse =
  components['schemas']['PageBattleSkillStatStageOperationResponse'];
export type PageBattleSkillFieldEffectResponse =
  components['schemas']['PageBattleSkillFieldEffectResponse'];
export type PageBattleSkillGlobalFieldEffectResponse =
  components['schemas']['PageBattleSkillGlobalFieldEffectResponse'];
export type PageBattleSkillWeatherAccuracyOverrideResponse =
  components['schemas']['PageBattleSkillWeatherAccuracyOverrideResponse'];
export type PageBattleSkillWeatherPowerModifierResponse =
  components['schemas']['PageBattleSkillWeatherPowerModifierResponse'];
export type PageBattleSkillWeatherElementOverrideResponse =
  components['schemas']['PageBattleSkillWeatherElementOverrideResponse'];
export type PageBattleSkillTerrainPowerModifierResponse =
  components['schemas']['PageBattleSkillTerrainPowerModifierResponse'];
export type PageBattleSkillTerrainElementOverrideResponse =
  components['schemas']['PageBattleSkillTerrainElementOverrideResponse'];
export type PageBattleSkillChargeSkipWeatherResponse =
  components['schemas']['PageBattleSkillChargeSkipWeatherResponse'];
export type PageBattleAbilityRuleResponse = components['schemas']['PageBattleAbilityRuleResponse'];
export type PageBattleItemRuleResponse = components['schemas']['PageBattleItemRuleResponse'];

export interface BattleRulePageQuery {
  page?: number;
  size?: number;
  q?: string;
}

export interface BattleFormatRestrictionListQuery extends BattleRulePageQuery {
  formatId?: string;
}

export interface BattleFormatClauseBindingListQuery {
  page?: number;
  size?: number;
  formatId?: string;
  clauseId?: string;
}

export interface BattleFormatSpecialMechanicListQuery {
  page?: number;
  size?: number;
  formatId?: string;
  mechanicId?: string;
}

export interface BattleSkillRuleListQuery extends BattleRulePageQuery {
  skillId?: string;
}

export interface BattleSkillStatusEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  statusRuleId?: string;
}

export interface BattleSkillStatStageEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  statId?: string;
}

export interface BattleSkillStatStageOperationListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  statId?: string;
  operationKind?: string;
}

export interface BattleSkillFieldEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  fieldRuleId?: string;
}

export interface BattleSkillGlobalFieldEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  fieldRuleId?: string;
}

export interface BattleSkillWeatherModifierListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  weatherRuleId?: string;
  targetElementId?: string;
}

export interface BattleSkillTerrainModifierListQuery {
  page?: number;
  size?: number;
  skillRuleId?: string;
  terrainRuleId?: string;
  targetElementId?: string;
}

export interface BattleAbilityRuleListQuery extends BattleRulePageQuery {
  abilityId?: string;
  triggerTiming?: string;
}

export interface BattleItemRuleListQuery extends BattleRulePageQuery {
  itemId?: string;
  triggerTiming?: string;
}

interface BattleRuleResourceApi<Response, Request, Page, Query> {
  list: (query: Query) => Promise<Page>;
  get: (id: string) => Promise<Response>;
  create: (body: Request) => Promise<Response>;
  update: (id: string, body: Request) => Promise<Response>;
  remove: (id: string) => Promise<void>;
}

function createBattleRuleResourceApi<Response, Request, Page, Query>(
  request: ApiRequest,
  path: `/api/battle-rules/${string}`,
): BattleRuleResourceApi<Response, Request, Page, Query> {
  return {
    list: (query: Query) =>
      request<Page>('GET', path, {
        params: { query: query as object },
      }),
    get: (id) =>
      request<Response>('GET', `${path}/{id}`, {
        params: { path: { id } },
      }),
    create: (body: Request) => request<Response>('POST', path, { body }),
    update: (id, body: Request) =>
      request<Response>('PUT', `${path}/{id}`, {
        params: { path: { id } },
        body,
      }),
    remove: (id) =>
      request<void>('DELETE', `${path}/{id}`, {
        params: { path: { id } },
      }),
  };
}

/**
 * 战斗规则资料 API。
 *
 * 每个资源都显式暴露自己的方法，页面层不传资源 key 拼 URL。`createBattleRuleResourceApi` 只收敛重复的
 * HTTP 调用样板，不表达任何业务资源模型。
 */
export function createBattleRulesServices(request: ApiRequest = apiRequest) {
  return {
    battleFormats: createBattleRuleResourceApi<
      BattleFormatResponse,
      BattleFormatRequest,
      PageBattleFormatResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/battle-formats'),
    formatClauses: createBattleRuleResourceApi<
      BattleFormatClauseResponse,
      BattleFormatClauseRequest,
      PageBattleFormatClauseResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/format-clauses'),
    formatClauseBindings: createBattleRuleResourceApi<
      BattleFormatClauseBindingResponse,
      BattleFormatClauseBindingRequest,
      PageBattleFormatClauseBindingResponse,
      BattleFormatClauseBindingListQuery
    >(request, '/api/battle-rules/format-clause-bindings'),
    formatRestrictions: createBattleRuleResourceApi<
      BattleFormatRestrictionResponse,
      BattleFormatRestrictionRequest,
      PageBattleFormatRestrictionResponse,
      BattleFormatRestrictionListQuery
    >(request, '/api/battle-rules/format-restrictions'),
    specialMechanics: createBattleRuleResourceApi<
      BattleSpecialMechanicResponse,
      BattleSpecialMechanicRequest,
      PageBattleSpecialMechanicResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/special-mechanics'),
    formatSpecialMechanics: createBattleRuleResourceApi<
      BattleFormatSpecialMechanicResponse,
      BattleFormatSpecialMechanicRequest,
      PageBattleFormatSpecialMechanicResponse,
      BattleFormatSpecialMechanicListQuery
    >(request, '/api/battle-rules/format-special-mechanics'),
    statusRules: createBattleRuleResourceApi<
      BattleStatusRuleResponse,
      BattleStatusRuleRequest,
      PageBattleStatusRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/status-rules'),
    weatherRules: createBattleRuleResourceApi<
      BattleWeatherRuleResponse,
      BattleWeatherRuleRequest,
      PageBattleWeatherRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/weather-rules'),
    terrainRules: createBattleRuleResourceApi<
      BattleTerrainRuleResponse,
      BattleTerrainRuleRequest,
      PageBattleTerrainRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/terrain-rules'),
    fieldRules: createBattleRuleResourceApi<
      BattleFieldRuleResponse,
      BattleFieldRuleRequest,
      PageBattleFieldRuleResponse,
      BattleRulePageQuery
    >(request, '/api/battle-rules/field-rules'),
    skillRules: createBattleRuleResourceApi<
      BattleSkillRuleResponse,
      BattleSkillRuleRequest,
      PageBattleSkillRuleResponse,
      BattleSkillRuleListQuery
    >(request, '/api/battle-rules/skill-rules'),
    skillStatusEffects: createBattleRuleResourceApi<
      BattleSkillStatusEffectResponse,
      BattleSkillStatusEffectRequest,
      PageBattleSkillStatusEffectResponse,
      BattleSkillStatusEffectListQuery
    >(request, '/api/battle-rules/skill-status-effects'),
    skillStatStageEffects: createBattleRuleResourceApi<
      BattleSkillStatStageEffectResponse,
      BattleSkillStatStageEffectRequest,
      PageBattleSkillStatStageEffectResponse,
      BattleSkillStatStageEffectListQuery
    >(request, '/api/battle-rules/skill-stat-stage-effects'),
    skillStatStageOperations: createBattleRuleResourceApi<
      BattleSkillStatStageOperationResponse,
      BattleSkillStatStageOperationRequest,
      PageBattleSkillStatStageOperationResponse,
      BattleSkillStatStageOperationListQuery
    >(request, '/api/battle-rules/skill-stat-stage-operations'),
    skillFieldEffects: createBattleRuleResourceApi<
      BattleSkillFieldEffectResponse,
      BattleSkillFieldEffectRequest,
      PageBattleSkillFieldEffectResponse,
      BattleSkillFieldEffectListQuery
    >(request, '/api/battle-rules/skill-field-effects'),
    skillGlobalFieldEffects: createBattleRuleResourceApi<
      BattleSkillGlobalFieldEffectResponse,
      BattleSkillGlobalFieldEffectRequest,
      PageBattleSkillGlobalFieldEffectResponse,
      BattleSkillGlobalFieldEffectListQuery
    >(request, '/api/battle-rules/skill-global-field-effects'),
    skillWeatherAccuracyOverrides: createBattleRuleResourceApi<
      BattleSkillWeatherAccuracyOverrideResponse,
      BattleSkillWeatherAccuracyOverrideRequest,
      PageBattleSkillWeatherAccuracyOverrideResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-accuracy-overrides'),
    skillWeatherPowerModifiers: createBattleRuleResourceApi<
      BattleSkillWeatherPowerModifierResponse,
      BattleSkillWeatherPowerModifierRequest,
      PageBattleSkillWeatherPowerModifierResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-power-modifiers'),
    skillWeatherElementOverrides: createBattleRuleResourceApi<
      BattleSkillWeatherElementOverrideResponse,
      BattleSkillWeatherElementOverrideRequest,
      PageBattleSkillWeatherElementOverrideResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-element-overrides'),
    skillTerrainPowerModifiers: createBattleRuleResourceApi<
      BattleSkillTerrainPowerModifierResponse,
      BattleSkillTerrainPowerModifierRequest,
      PageBattleSkillTerrainPowerModifierResponse,
      BattleSkillTerrainModifierListQuery
    >(request, '/api/battle-rules/skill-terrain-power-modifiers'),
    skillTerrainElementOverrides: createBattleRuleResourceApi<
      BattleSkillTerrainElementOverrideResponse,
      BattleSkillTerrainElementOverrideRequest,
      PageBattleSkillTerrainElementOverrideResponse,
      BattleSkillTerrainModifierListQuery
    >(request, '/api/battle-rules/skill-terrain-element-overrides'),
    skillChargeSkipWeathers: createBattleRuleResourceApi<
      BattleSkillChargeSkipWeatherResponse,
      BattleSkillChargeSkipWeatherRequest,
      PageBattleSkillChargeSkipWeatherResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-charge-skip-weathers'),
    abilityRules: createBattleRuleResourceApi<
      BattleAbilityRuleResponse,
      BattleAbilityRuleRequest,
      PageBattleAbilityRuleResponse,
      BattleAbilityRuleListQuery
    >(request, '/api/battle-rules/ability-rules'),
    itemRules: createBattleRuleResourceApi<
      BattleItemRuleResponse,
      BattleItemRuleRequest,
      PageBattleItemRuleResponse,
      BattleItemRuleListQuery
    >(request, '/api/battle-rules/item-rules'),
    runtime: {
      getByFormatCode: (formatCode: string) =>
        request<BattleRuntimeSnapshot>('GET', '/api/battle-rules/runtime/formats/{formatCode}', {
          params: { path: { formatCode } },
        }),
      validatePreparation: (body: BattlePreparationValidationRequest) =>
        request<BattlePreparationValidationResponse>(
          'POST',
          '/api/battle-rules/runtime/preparation-validation',
          { body },
        ),
      validateActions: (body: BattleActionValidationRequest) =>
        request<BattleActionValidationResponse>(
          'POST',
          '/api/battle-rules/runtime/action-validation',
          { body },
        ),
    },
  };
}

export const battleRulesServices = createBattleRulesServices();
