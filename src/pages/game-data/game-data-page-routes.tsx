import type { ReactElement } from 'react';
import { lazyPage } from '../../app/lazy-page';
import type { GameDataResourceKey } from '../../services/game-data/shared';

const CreaturesPage = lazyPage(() => import('./creatures/CreaturesPage'), 'CreaturesPage');
const SpeciesPage = lazyPage(() => import('./species/SpeciesPage'), 'SpeciesPage');
const SkillsPage = lazyPage(() => import('./skills/SkillsPage'), 'SkillsPage');
const AbilitiesPage = lazyPage(() => import('./abilities/AbilitiesPage'), 'AbilitiesPage');
const ItemsPage = lazyPage(() => import('./items/ItemsPage'), 'ItemsPage');
const ElementsPage = lazyPage(() => import('./elements/ElementsPage'), 'ElementsPage');
const StatsPage = lazyPage(() => import('./stats/StatsPage'), 'StatsPage');
const SkillDamageClassesPage = lazyPage(
  () => import('./skill-damage-classes/SkillDamageClassesPage'),
  'SkillDamageClassesPage',
);
const ItemCategoriesPage = lazyPage(
  () => import('./item-categories/ItemCategoriesPage'),
  'ItemCategoriesPage',
);
const SpeciesColorsPage = lazyPage(
  () => import('./species-colors/SpeciesColorsPage'),
  'SpeciesColorsPage',
);
const SpeciesShapesPage = lazyPage(
  () => import('./species-shapes/SpeciesShapesPage'),
  'SpeciesShapesPage',
);
const HabitatsPage = lazyPage(() => import('./habitats/HabitatsPage'), 'HabitatsPage');
const EggGroupsPage = lazyPage(() => import('./egg-groups/EggGroupsPage'), 'EggGroupsPage');
const SpeciesEggGroupsPage = lazyPage(
  () => import('./species-egg-groups/SpeciesEggGroupsPage'),
  'SpeciesEggGroupsPage',
);
const CreatureElementsPage = lazyPage(
  () => import('./creature-elements/CreatureElementsPage'),
  'CreatureElementsPage',
);
const CreatureStatsPage = lazyPage(
  () => import('./creature-stats/CreatureStatsPage'),
  'CreatureStatsPage',
);
const CreatureAbilitiesPage = lazyPage(
  () => import('./creature-abilities/CreatureAbilitiesPage'),
  'CreatureAbilitiesPage',
);
const ItemAttributesPage = lazyPage(
  () => import('./item-attributes/ItemAttributesPage'),
  'ItemAttributesPage',
);
const ItemFlingEffectsPage = lazyPage(
  () => import('./item-fling-effects/ItemFlingEffectsPage'),
  'ItemFlingEffectsPage',
);
const ItemPocketsPage = lazyPage(() => import('./item-pockets/ItemPocketsPage'), 'ItemPocketsPage');
const ItemDetailsPage = lazyPage(() => import('./item-details/ItemDetailsPage'), 'ItemDetailsPage');
const ItemAttributeBindingsPage = lazyPage(
  () => import('./item-attribute-bindings/ItemAttributeBindingsPage'),
  'ItemAttributeBindingsPage',
);
const ItemCategoryPocketsPage = lazyPage(
  () => import('./item-category-pockets/ItemCategoryPocketsPage'),
  'ItemCategoryPocketsPage',
);
const SkillAilmentsPage = lazyPage(
  () => import('./skill-ailments/SkillAilmentsPage'),
  'SkillAilmentsPage',
);
const SkillCategoriesPage = lazyPage(
  () => import('./skill-categories/SkillCategoriesPage'),
  'SkillCategoriesPage',
);
const SkillLearnMethodsPage = lazyPage(
  () => import('./skill-learn-methods/SkillLearnMethodsPage'),
  'SkillLearnMethodsPage',
);
const SkillTargetsPage = lazyPage(
  () => import('./skill-targets/SkillTargetsPage'),
  'SkillTargetsPage',
);
const SkillDetailsPage = lazyPage(
  () => import('./skill-details/SkillDetailsPage'),
  'SkillDetailsPage',
);
const SkillStatChangesPage = lazyPage(
  () => import('./skill-stat-changes/SkillStatChangesPage'),
  'SkillStatChangesPage',
);
const GrowthRatesPage = lazyPage(() => import('./growth-rates/GrowthRatesPage'), 'GrowthRatesPage');
const NaturesPage = lazyPage(() => import('./natures/NaturesPage'), 'NaturesPage');
const RegionsPage = lazyPage(() => import('./regions/RegionsPage'), 'RegionsPage');
const LocationsPage = lazyPage(() => import('./locations/LocationsPage'), 'LocationsPage');
const EncounterMethodsPage = lazyPage(
  () => import('./encounter-methods/EncounterMethodsPage'),
  'EncounterMethodsPage',
);
const EncounterConditionsPage = lazyPage(
  () => import('./encounter-conditions/EncounterConditionsPage'),
  'EncounterConditionsPage',
);
const EncounterConditionValuesPage = lazyPage(
  () => import('./encounter-condition-values/EncounterConditionValuesPage'),
  'EncounterConditionValuesPage',
);
const LocationAreasPage = lazyPage(
  () => import('./location-areas/LocationAreasPage'),
  'LocationAreasPage',
);
const LocationAreaMethodRatesPage = lazyPage(
  () => import('./location-area-method-rates/LocationAreaMethodRatesPage'),
  'LocationAreaMethodRatesPage',
);
const LocationAreaEncountersPage = lazyPage(
  () => import('./location-area-encounters/LocationAreaEncountersPage'),
  'LocationAreaEncountersPage',
);
const LocationAreaEncounterConditionValuesPage = lazyPage(
  () =>
    import('./location-area-encounter-condition-values/LocationAreaEncounterConditionValuesPage'),
  'LocationAreaEncounterConditionValuesPage',
);
const GendersPage = lazyPage(() => import('./genders/GendersPage'), 'GendersPage');
const EvolutionTriggersPage = lazyPage(
  () => import('./evolution-triggers/EvolutionTriggersPage'),
  'EvolutionTriggersPage',
);
const EvolutionChainsPage = lazyPage(
  () => import('./evolution-chains/EvolutionChainsPage'),
  'EvolutionChainsPage',
);
const EvolutionNodesPage = lazyPage(
  () => import('./evolution-nodes/EvolutionNodesPage'),
  'EvolutionNodesPage',
);
const EvolutionDetailsPage = lazyPage(
  () => import('./evolution-details/EvolutionDetailsPage'),
  'EvolutionDetailsPage',
);
const CreatureFormsPage = lazyPage(
  () => import('./creature-forms/CreatureFormsPage'),
  'CreatureFormsPage',
);
const CreatureFormElementsPage = lazyPage(
  () => import('./creature-form-elements/CreatureFormElementsPage'),
  'CreatureFormElementsPage',
);
const AbilityDetailsPage = lazyPage(
  () => import('./ability-details/AbilityDetailsPage'),
  'AbilityDetailsPage',
);
const SpeciesDetailsPage = lazyPage(
  () => import('./species-details/SpeciesDetailsPage'),
  'SpeciesDetailsPage',
);
const CreatureSkillLearnsPage = lazyPage(
  () => import('./creature-skill-learns/CreatureSkillLearnsPage'),
  'CreatureSkillLearnsPage',
);
const CreatureHeldItemsPage = lazyPage(
  () => import('./creature-held-items/CreatureHeldItemsPage'),
  'CreatureHeldItemsPage',
);
const ElementDamageRelationsPage = lazyPage(
  () => import('./element-damage-relations/ElementDamageRelationsPage'),
  'ElementDamageRelationsPage',
);

export const gameDataPageRoutes = [
  { path: 'creatures', label: '精灵资料', iconKey: 'lucide:badge', element: <CreaturesPage /> },
  { path: 'species', label: '种类资料', iconKey: 'lucide:tags', element: <SpeciesPage /> },
  { path: 'skills', label: '技能资料', iconKey: 'lucide:sparkles', element: <SkillsPage /> },
  {
    path: 'abilities',
    label: '特性资料',
    iconKey: 'lucide:badge-check',
    element: <AbilitiesPage />,
  },
  { path: 'items', label: '道具资料', iconKey: 'lucide:package', element: <ItemsPage /> },
  { path: 'elements', label: '属性资料', iconKey: 'lucide:flame', element: <ElementsPage /> },
  {
    path: 'stats',
    label: '数值项',
    iconKey: 'lucide:chart-no-axes-column',
    element: <StatsPage />,
  },
  {
    path: 'skill-damage-classes',
    label: '技能分类',
    iconKey: 'lucide:split',
    element: <SkillDamageClassesPage />,
  },
  {
    path: 'item-categories',
    label: '道具分类',
    iconKey: 'lucide:folder-tree',
    element: <ItemCategoriesPage />,
  },
  {
    path: 'species-colors',
    label: '种类颜色',
    iconKey: 'lucide:palette',
    element: <SpeciesColorsPage />,
  },
  {
    path: 'species-shapes',
    label: '种类形态',
    iconKey: 'lucide:shapes',
    element: <SpeciesShapesPage />,
  },
  { path: 'habitats', label: '栖息地', iconKey: 'lucide:map', element: <HabitatsPage /> },
  { path: 'egg-groups', label: '种类分组', iconKey: 'lucide:layers-3', element: <EggGroupsPage /> },
  {
    path: 'species-egg-groups',
    label: '种类分组绑定',
    iconKey: 'lucide:git-branch',
    element: <SpeciesEggGroupsPage />,
  },
  {
    path: 'creature-elements',
    label: '精灵属性绑定',
    iconKey: 'lucide:git-branch',
    element: <CreatureElementsPage />,
  },
  {
    path: 'creature-stats',
    label: '精灵数值绑定',
    iconKey: 'lucide:git-branch',
    element: <CreatureStatsPage />,
  },
  {
    path: 'creature-abilities',
    label: '精灵特性绑定',
    iconKey: 'lucide:git-branch',
    element: <CreatureAbilitiesPage />,
  },
  {
    path: 'item-attributes',
    label: '道具属性',
    iconKey: 'lucide:badge-info',
    element: <ItemAttributesPage />,
  },
  {
    path: 'item-fling-effects',
    label: '道具投掷效果',
    iconKey: 'lucide:send',
    element: <ItemFlingEffectsPage />,
  },
  {
    path: 'item-pockets',
    label: '道具口袋',
    iconKey: 'lucide:briefcase',
    element: <ItemPocketsPage />,
  },
  {
    path: 'item-details',
    label: '道具详情',
    iconKey: 'lucide:file-text',
    element: <ItemDetailsPage />,
  },
  {
    path: 'item-attribute-bindings',
    label: '道具属性绑定',
    iconKey: 'lucide:git-branch',
    element: <ItemAttributeBindingsPage />,
  },
  {
    path: 'item-category-pockets',
    label: '道具分类口袋',
    iconKey: 'lucide:git-branch',
    element: <ItemCategoryPocketsPage />,
  },
  {
    path: 'skill-ailments',
    label: '技能异常',
    iconKey: 'lucide:activity',
    element: <SkillAilmentsPage />,
  },
  {
    path: 'skill-categories',
    label: '技能元分类',
    iconKey: 'lucide:folder-tree',
    element: <SkillCategoriesPage />,
  },
  {
    path: 'skill-learn-methods',
    label: '技能学习方式',
    iconKey: 'lucide:graduation-cap',
    element: <SkillLearnMethodsPage />,
  },
  {
    path: 'skill-targets',
    label: '技能目标',
    iconKey: 'lucide:crosshair',
    element: <SkillTargetsPage />,
  },
  {
    path: 'skill-details',
    label: '技能详情',
    iconKey: 'lucide:file-text',
    element: <SkillDetailsPage />,
  },
  {
    path: 'skill-stat-changes',
    label: '技能数值变化',
    iconKey: 'lucide:chart-no-axes-column',
    element: <SkillStatChangesPage />,
  },
  {
    path: 'growth-rates',
    label: '成长速率',
    iconKey: 'lucide:trending-up',
    element: <GrowthRatesPage />,
  },
  { path: 'natures', label: '性格资料', iconKey: 'lucide:smile', element: <NaturesPage /> },
  { path: 'regions', label: '地区资料', iconKey: 'lucide:map', element: <RegionsPage /> },
  { path: 'locations', label: '地点资料', iconKey: 'lucide:map-pin', element: <LocationsPage /> },
  {
    path: 'encounter-methods',
    label: '遭遇方式',
    iconKey: 'lucide:footprints',
    element: <EncounterMethodsPage />,
  },
  {
    path: 'encounter-conditions',
    label: '遭遇条件',
    iconKey: 'lucide:filter',
    element: <EncounterConditionsPage />,
  },
  {
    path: 'encounter-condition-values',
    label: '遭遇条件值',
    iconKey: 'lucide:list-checks',
    element: <EncounterConditionValuesPage />,
  },
  {
    path: 'location-areas',
    label: '地点区域',
    iconKey: 'lucide:map-pinned',
    element: <LocationAreasPage />,
  },
  {
    path: 'location-area-method-rates',
    label: '区域遭遇方式概率',
    iconKey: 'lucide:percent',
    element: <LocationAreaMethodRatesPage />,
  },
  {
    path: 'location-area-encounters',
    label: '区域精灵遭遇',
    iconKey: 'lucide:radar',
    element: <LocationAreaEncountersPage />,
  },
  {
    path: 'location-area-encounter-condition-values',
    label: '区域遭遇条件绑定',
    iconKey: 'lucide:git-branch',
    element: <LocationAreaEncounterConditionValuesPage />,
  },
  {
    path: 'genders',
    label: '性别资料',
    iconKey: 'lucide:venus-and-mars',
    element: <GendersPage />,
  },
  {
    path: 'evolution-triggers',
    label: '进化触发器',
    iconKey: 'lucide:zap',
    element: <EvolutionTriggersPage />,
  },
  {
    path: 'evolution-chains',
    label: '进化链',
    iconKey: 'lucide:workflow',
    element: <EvolutionChainsPage />,
  },
  {
    path: 'evolution-nodes',
    label: '进化链节点',
    iconKey: 'lucide:git-fork',
    element: <EvolutionNodesPage />,
  },
  {
    path: 'evolution-details',
    label: '进化条件',
    iconKey: 'lucide:route',
    element: <EvolutionDetailsPage />,
  },
  {
    path: 'creature-forms',
    label: '精灵形态',
    iconKey: 'lucide:badge',
    element: <CreatureFormsPage />,
  },
  {
    path: 'creature-form-elements',
    label: '精灵形态属性',
    iconKey: 'lucide:git-branch',
    element: <CreatureFormElementsPage />,
  },
  {
    path: 'ability-details',
    label: '特性详情',
    iconKey: 'lucide:file-text',
    element: <AbilityDetailsPage />,
  },
  {
    path: 'species-details',
    label: '种类详情',
    iconKey: 'lucide:file-text',
    element: <SpeciesDetailsPage />,
  },
  {
    path: 'creature-skill-learns',
    label: '精灵技能学习',
    iconKey: 'lucide:graduation-cap',
    element: <CreatureSkillLearnsPage />,
  },
  {
    path: 'creature-held-items',
    label: '精灵持有道具',
    iconKey: 'lucide:package',
    element: <CreatureHeldItemsPage />,
  },
  {
    path: 'element-damage-relations',
    label: '属性克制关系',
    iconKey: 'lucide:split',
    element: <ElementDamageRelationsPage />,
  },
] satisfies readonly {
  path: GameDataResourceKey;
  label: string;
  iconKey: string;
  element: ReactElement;
}[];
