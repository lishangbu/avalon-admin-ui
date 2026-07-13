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
  {
    path: 'battle-formats',
    label: '战斗赛制',
    iconKey: 'lucide:layout-list',
    element: <BattleFormatsPage />,
  },
  {
    path: 'format-clauses',
    label: '赛制条款',
    iconKey: 'lucide:list-checks',
    element: <FormatClausesPage />,
  },
  {
    path: 'format-clause-bindings',
    label: '赛制条款绑定',
    iconKey: 'lucide:git-branch',
    element: <FormatClauseBindingsPage />,
  },
  {
    path: 'format-restrictions',
    label: '赛制限制',
    iconKey: 'lucide:ban',
    element: <FormatRestrictionsPage />,
  },
  {
    path: 'preparation-validation',
    label: '准备校验',
    iconKey: 'lucide:list-checks',
    element: <PreparationValidationPage />,
  },
  {
    path: 'action-validation',
    label: '行动校验',
    iconKey: 'lucide:list-checks',
    element: <ActionValidationPage />,
  },
  {
    path: 'special-mechanics',
    label: '特殊机制',
    iconKey: 'lucide:sparkles',
    element: <SpecialMechanicsPage />,
  },
  {
    path: 'format-special-mechanics',
    label: '赛制特殊机制',
    iconKey: 'lucide:git-branch',
    element: <FormatSpecialMechanicsPage />,
  },
  {
    path: 'status-rules',
    label: '状态规则',
    iconKey: 'lucide:activity',
    element: <StatusRulesPage />,
  },
  {
    path: 'weather-rules',
    label: '天气规则',
    iconKey: 'lucide:cloud-sun',
    element: <WeatherRulesPage />,
  },
  {
    path: 'terrain-rules',
    label: '场地规则',
    iconKey: 'lucide:land-plot',
    element: <TerrainRulesPage />,
  },
  { path: 'field-rules', label: '场上效果', iconKey: 'lucide:shield', element: <FieldRulesPage /> },
  {
    path: 'skill-rules',
    label: '技能规则',
    iconKey: 'lucide:sparkles',
    element: <SkillRulesPage />,
  },
  {
    path: 'skill-status-effects',
    label: '技能状态效果',
    iconKey: 'lucide:activity',
    element: <SkillStatusEffectsPage />,
  },
  {
    path: 'skill-stat-stage-effects',
    label: '技能能力阶级效果',
    iconKey: 'lucide:chart-no-axes-column',
    element: <SkillStatStageEffectsPage />,
  },
  {
    path: 'skill-stat-stage-operations',
    label: '技能能力阶级操作',
    iconKey: 'lucide:chart-no-axes-combined',
    element: <SkillStatStageOperationsPage />,
  },
  {
    path: 'skill-field-effects',
    label: '技能场上效果',
    iconKey: 'lucide:shield-plus',
    element: <SkillFieldEffectsPage />,
  },
  {
    path: 'skill-global-field-effects',
    label: '技能全局场地',
    iconKey: 'lucide:sparkle',
    element: <SkillGlobalFieldEffectsPage />,
  },
  {
    path: 'skill-weather-accuracy-overrides',
    label: '技能天气命中',
    iconKey: 'lucide:cloud-sun',
    element: <SkillWeatherAccuracyOverridesPage />,
  },
  {
    path: 'skill-weather-power-modifiers',
    label: '技能天气威力',
    iconKey: 'lucide:cloud-lightning',
    element: <SkillWeatherPowerModifiersPage />,
  },
  {
    path: 'skill-weather-element-overrides',
    label: '技能天气属性',
    iconKey: 'lucide:cloud-sun-rain',
    element: <SkillWeatherElementOverridesPage />,
  },
  {
    path: 'skill-terrain-power-modifiers',
    label: '技能场地威力',
    iconKey: 'lucide:map',
    element: <SkillTerrainPowerModifiersPage />,
  },
  {
    path: 'skill-terrain-element-overrides',
    label: '技能场地属性',
    iconKey: 'lucide:palette',
    element: <SkillTerrainElementOverridesPage />,
  },
  {
    path: 'skill-charge-skip-weathers',
    label: '技能蓄力天气',
    iconKey: 'lucide:sun',
    element: <SkillChargeSkipWeathersPage />,
  },
  {
    path: 'ability-rules',
    label: '特性规则',
    iconKey: 'lucide:badge-check',
    element: <AbilityRulesPage />,
  },
  { path: 'item-rules', label: '道具规则', iconKey: 'lucide:package', element: <ItemRulesPage /> },
] satisfies readonly { path: string; label: string; iconKey: string; element: ReactElement }[];
