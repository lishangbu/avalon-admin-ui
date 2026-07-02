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
export interface BattleSkillTerrainPowerModifierResponse {
  id: number;
  skillRuleId: number;
  terrainRuleId: number;
  powerMultiplier: number;
  enabled: boolean;
  sortOrder: number;
}
export interface BattleSkillTerrainElementOverrideResponse {
  id: number;
  skillRuleId: number;
  terrainRuleId: number;
  targetElementId: number;
  enabled: boolean;
  sortOrder: number;
}
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
export interface BattleSkillTerrainPowerModifierRequest {
  skillRuleId: number;
  terrainRuleId: number;
  powerMultiplier: number;
  enabled: boolean;
  sortOrder: number;
}
export interface BattleSkillTerrainElementOverrideRequest {
  skillRuleId: number;
  terrainRuleId: number;
  targetElementId: number;
  enabled: boolean;
  sortOrder: number;
}
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
export interface PageBattleSkillTerrainPowerModifierResponse {
  rows?: BattleSkillTerrainPowerModifierResponse[];
  totalRowCount?: number;
  totalPageCount?: number;
}
export interface PageBattleSkillTerrainElementOverrideResponse {
  rows?: BattleSkillTerrainElementOverrideResponse[];
  totalRowCount?: number;
  totalPageCount?: number;
}
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

export interface BattleSkillStatStageOperationListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  statId?: number;
  operationKind?: string;
}

export interface BattleSkillFieldEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  fieldRuleId?: number;
}

export interface BattleSkillGlobalFieldEffectListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  fieldRuleId?: number;
}

export interface BattleSkillWeatherModifierListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  weatherRuleId?: number;
  targetElementId?: number;
}

export interface BattleSkillTerrainModifierListQuery {
  page?: number;
  size?: number;
  skillRuleId?: number;
  terrainRuleId?: number;
  targetElementId?: number;
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
    skillStatStageOperations: createCrudApi<
      BattleSkillStatStageOperationResponse,
      BattleSkillStatStageOperationRequest,
      PageBattleSkillStatStageOperationResponse,
      BattleSkillStatStageOperationListQuery
    >(request, '/api/battle-rules/skill-stat-stage-operations'),
    skillFieldEffects: createCrudApi<
      BattleSkillFieldEffectResponse,
      BattleSkillFieldEffectRequest,
      PageBattleSkillFieldEffectResponse,
      BattleSkillFieldEffectListQuery
    >(request, '/api/battle-rules/skill-field-effects'),
    skillGlobalFieldEffects: createCrudApi<
      BattleSkillGlobalFieldEffectResponse,
      BattleSkillGlobalFieldEffectRequest,
      PageBattleSkillGlobalFieldEffectResponse,
      BattleSkillGlobalFieldEffectListQuery
    >(request, '/api/battle-rules/skill-global-field-effects'),
    skillWeatherAccuracyOverrides: createCrudApi<
      BattleSkillWeatherAccuracyOverrideResponse,
      BattleSkillWeatherAccuracyOverrideRequest,
      PageBattleSkillWeatherAccuracyOverrideResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-accuracy-overrides'),
    skillWeatherPowerModifiers: createCrudApi<
      BattleSkillWeatherPowerModifierResponse,
      BattleSkillWeatherPowerModifierRequest,
      PageBattleSkillWeatherPowerModifierResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-power-modifiers'),
    skillWeatherElementOverrides: createCrudApi<
      BattleSkillWeatherElementOverrideResponse,
      BattleSkillWeatherElementOverrideRequest,
      PageBattleSkillWeatherElementOverrideResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-weather-element-overrides'),
    skillTerrainPowerModifiers: createCrudApi<
      BattleSkillTerrainPowerModifierResponse,
      BattleSkillTerrainPowerModifierRequest,
      PageBattleSkillTerrainPowerModifierResponse,
      BattleSkillTerrainModifierListQuery
    >(request, '/api/battle-rules/skill-terrain-power-modifiers'),
    skillTerrainElementOverrides: createCrudApi<
      BattleSkillTerrainElementOverrideResponse,
      BattleSkillTerrainElementOverrideRequest,
      PageBattleSkillTerrainElementOverrideResponse,
      BattleSkillTerrainModifierListQuery
    >(request, '/api/battle-rules/skill-terrain-element-overrides'),
    skillChargeSkipWeathers: createCrudApi<
      BattleSkillChargeSkipWeatherResponse,
      BattleSkillChargeSkipWeatherRequest,
      PageBattleSkillChargeSkipWeatherResponse,
      BattleSkillWeatherModifierListQuery
    >(request, '/api/battle-rules/skill-charge-skip-weathers'),
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
