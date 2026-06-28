import { AbilityRulesPage } from './ability-rules/AbilityRulesPage';
import { BattleFormatsPage } from './battle-formats/BattleFormatsPage';
import { FieldRulesPage } from './field-rules/FieldRulesPage';
import { FormatClauseBindingsPage } from './format-clause-bindings/FormatClauseBindingsPage';
import { FormatClausesPage } from './format-clauses/FormatClausesPage';
import { FormatRestrictionsPage } from './format-restrictions/FormatRestrictionsPage';
import { FormatSpecialMechanicsPage } from './format-special-mechanics/FormatSpecialMechanicsPage';
import { ItemRulesPage } from './item-rules/ItemRulesPage';
import { PreparationValidationPage } from './preparation-validation/PreparationValidationPage';
import { CoveragePage } from './rule-coverage/CoveragePage';
import { SkillRulesPage } from './skill-rules/SkillRulesPage';
import { SkillFieldEffectsPage } from './skill-field-effects/SkillFieldEffectsPage';
import { SkillGlobalFieldEffectsPage } from './skill-global-field-effects/SkillGlobalFieldEffectsPage';
import { SkillStatStageEffectsPage } from './skill-stat-stage-effects/SkillStatStageEffectsPage';
import { SkillStatusEffectsPage } from './skill-status-effects/SkillStatusEffectsPage';
import { SkillWeatherAccuracyOverridesPage } from './skill-weather-accuracy-overrides/SkillWeatherAccuracyOverridesPage';
import { SkillWeatherPowerModifiersPage } from './skill-weather-power-modifiers/SkillWeatherPowerModifiersPage';
import { SpecialMechanicsPage } from './special-mechanics/SpecialMechanicsPage';
import { StatusRulesPage } from './status-rules/StatusRulesPage';
import { TerrainRulesPage } from './terrain-rules/TerrainRulesPage';
import { WeatherRulesPage } from './weather-rules/WeatherRulesPage';

export const battleRulesPageRoutes = [
  { path: 'coverage', element: <CoveragePage /> },
  { path: 'battle-formats', element: <BattleFormatsPage /> },
  { path: 'format-clauses', element: <FormatClausesPage /> },
  { path: 'format-clause-bindings', element: <FormatClauseBindingsPage /> },
  { path: 'format-restrictions', element: <FormatRestrictionsPage /> },
  { path: 'preparation-validation', element: <PreparationValidationPage /> },
  { path: 'special-mechanics', element: <SpecialMechanicsPage /> },
  { path: 'format-special-mechanics', element: <FormatSpecialMechanicsPage /> },
  { path: 'status-rules', element: <StatusRulesPage /> },
  { path: 'weather-rules', element: <WeatherRulesPage /> },
  { path: 'terrain-rules', element: <TerrainRulesPage /> },
  { path: 'field-rules', element: <FieldRulesPage /> },
  { path: 'skill-rules', element: <SkillRulesPage /> },
  { path: 'skill-status-effects', element: <SkillStatusEffectsPage /> },
  { path: 'skill-stat-stage-effects', element: <SkillStatStageEffectsPage /> },
  { path: 'skill-field-effects', element: <SkillFieldEffectsPage /> },
  { path: 'skill-global-field-effects', element: <SkillGlobalFieldEffectsPage /> },
  { path: 'skill-weather-accuracy-overrides', element: <SkillWeatherAccuracyOverridesPage /> },
  { path: 'skill-weather-power-modifiers', element: <SkillWeatherPowerModifiersPage /> },
  { path: 'ability-rules', element: <AbilityRulesPage /> },
  { path: 'item-rules', element: <ItemRulesPage /> },
];
