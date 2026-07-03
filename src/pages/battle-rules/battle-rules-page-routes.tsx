import type { ReactElement } from 'react';
import { lazyPage } from '../../app/lazy-page';

const ActionValidationPage = lazyPage(
  () => import('./action-validation/ActionValidationPage'),
  'ActionValidationPage',
);
const AbilityRulesPage = lazyPage(
  () => import('./ability-rules/AbilityRulesPage'),
  'AbilityRulesPage',
);
const BattleFormatsPage = lazyPage(
  () => import('./battle-formats/BattleFormatsPage'),
  'BattleFormatsPage',
);
const FieldRulesPage = lazyPage(() => import('./field-rules/FieldRulesPage'), 'FieldRulesPage');
const FormatClauseBindingsPage = lazyPage(
  () => import('./format-clause-bindings/FormatClauseBindingsPage'),
  'FormatClauseBindingsPage',
);
const FormatClausesPage = lazyPage(
  () => import('./format-clauses/FormatClausesPage'),
  'FormatClausesPage',
);
const FormatRestrictionsPage = lazyPage(
  () => import('./format-restrictions/FormatRestrictionsPage'),
  'FormatRestrictionsPage',
);
const FormatSpecialMechanicsPage = lazyPage(
  () => import('./format-special-mechanics/FormatSpecialMechanicsPage'),
  'FormatSpecialMechanicsPage',
);
const ItemRulesPage = lazyPage(() => import('./item-rules/ItemRulesPage'), 'ItemRulesPage');
const PreparationValidationPage = lazyPage(
  () => import('./preparation-validation/PreparationValidationPage'),
  'PreparationValidationPage',
);
const SkillRulesPage = lazyPage(() => import('./skill-rules/SkillRulesPage'), 'SkillRulesPage');
const SkillChargeSkipWeathersPage = lazyPage(
  () => import('./skill-charge-skip-weathers/SkillChargeSkipWeathersPage'),
  'SkillChargeSkipWeathersPage',
);
const SkillFieldEffectsPage = lazyPage(
  () => import('./skill-field-effects/SkillFieldEffectsPage'),
  'SkillFieldEffectsPage',
);
const SkillGlobalFieldEffectsPage = lazyPage(
  () => import('./skill-global-field-effects/SkillGlobalFieldEffectsPage'),
  'SkillGlobalFieldEffectsPage',
);
const SkillStatStageEffectsPage = lazyPage(
  () => import('./skill-stat-stage-effects/SkillStatStageEffectsPage'),
  'SkillStatStageEffectsPage',
);
const SkillStatStageOperationsPage = lazyPage(
  () => import('./skill-stat-stage-operations/SkillStatStageOperationsPage'),
  'SkillStatStageOperationsPage',
);
const SkillStatusEffectsPage = lazyPage(
  () => import('./skill-status-effects/SkillStatusEffectsPage'),
  'SkillStatusEffectsPage',
);
const SkillTerrainElementOverridesPage = lazyPage(
  () => import('./skill-terrain-element-overrides/SkillTerrainElementOverridesPage'),
  'SkillTerrainElementOverridesPage',
);
const SkillTerrainPowerModifiersPage = lazyPage(
  () => import('./skill-terrain-power-modifiers/SkillTerrainPowerModifiersPage'),
  'SkillTerrainPowerModifiersPage',
);
const SkillWeatherAccuracyOverridesPage = lazyPage(
  () => import('./skill-weather-accuracy-overrides/SkillWeatherAccuracyOverridesPage'),
  'SkillWeatherAccuracyOverridesPage',
);
const SkillWeatherElementOverridesPage = lazyPage(
  () => import('./skill-weather-element-overrides/SkillWeatherElementOverridesPage'),
  'SkillWeatherElementOverridesPage',
);
const SkillWeatherPowerModifiersPage = lazyPage(
  () => import('./skill-weather-power-modifiers/SkillWeatherPowerModifiersPage'),
  'SkillWeatherPowerModifiersPage',
);
const SpecialMechanicsPage = lazyPage(
  () => import('./special-mechanics/SpecialMechanicsPage'),
  'SpecialMechanicsPage',
);
const StatusRulesPage = lazyPage(() => import('./status-rules/StatusRulesPage'), 'StatusRulesPage');
const TerrainRulesPage = lazyPage(
  () => import('./terrain-rules/TerrainRulesPage'),
  'TerrainRulesPage',
);
const WeatherRulesPage = lazyPage(
  () => import('./weather-rules/WeatherRulesPage'),
  'WeatherRulesPage',
);

export const battleRulesPageRoutes = [
  { path: 'battle-formats', element: <BattleFormatsPage /> },
  { path: 'format-clauses', element: <FormatClausesPage /> },
  { path: 'format-clause-bindings', element: <FormatClauseBindingsPage /> },
  { path: 'format-restrictions', element: <FormatRestrictionsPage /> },
  { path: 'preparation-validation', element: <PreparationValidationPage /> },
  { path: 'action-validation', element: <ActionValidationPage /> },
  { path: 'special-mechanics', element: <SpecialMechanicsPage /> },
  { path: 'format-special-mechanics', element: <FormatSpecialMechanicsPage /> },
  { path: 'status-rules', element: <StatusRulesPage /> },
  { path: 'weather-rules', element: <WeatherRulesPage /> },
  { path: 'terrain-rules', element: <TerrainRulesPage /> },
  { path: 'field-rules', element: <FieldRulesPage /> },
  { path: 'skill-rules', element: <SkillRulesPage /> },
  { path: 'skill-status-effects', element: <SkillStatusEffectsPage /> },
  { path: 'skill-stat-stage-effects', element: <SkillStatStageEffectsPage /> },
  { path: 'skill-stat-stage-operations', element: <SkillStatStageOperationsPage /> },
  { path: 'skill-field-effects', element: <SkillFieldEffectsPage /> },
  { path: 'skill-global-field-effects', element: <SkillGlobalFieldEffectsPage /> },
  { path: 'skill-weather-accuracy-overrides', element: <SkillWeatherAccuracyOverridesPage /> },
  { path: 'skill-weather-power-modifiers', element: <SkillWeatherPowerModifiersPage /> },
  { path: 'skill-weather-element-overrides', element: <SkillWeatherElementOverridesPage /> },
  { path: 'skill-terrain-power-modifiers', element: <SkillTerrainPowerModifiersPage /> },
  { path: 'skill-terrain-element-overrides', element: <SkillTerrainElementOverridesPage /> },
  { path: 'skill-charge-skip-weathers', element: <SkillChargeSkipWeathersPage /> },
  { path: 'ability-rules', element: <AbilityRulesPage /> },
  { path: 'item-rules', element: <ItemRulesPage /> },
] satisfies readonly { path: string; element: ReactElement }[];
