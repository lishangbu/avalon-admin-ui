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
const ContestTypesPage = lazyPage(
  () => import('./contest-types/ContestTypesPage'),
  'ContestTypesPage',
);
const ContestEffectsPage = lazyPage(
  () => import('./contest-effects/ContestEffectsPage'),
  'ContestEffectsPage',
);
const AdvancedContestEffectsPage = lazyPage(
  () => import('./advanced-contest-effects/AdvancedContestEffectsPage'),
  'AdvancedContestEffectsPage',
);
const AdvancedContestEffectSkillsPage = lazyPage(
  () => import('./advanced-contest-effect-skills/AdvancedContestEffectSkillsPage'),
  'AdvancedContestEffectSkillsPage',
);
const BerryFirmnessesPage = lazyPage(
  () => import('./berry-firmnesses/BerryFirmnessesPage'),
  'BerryFirmnessesPage',
);
const BerryFlavorsPage = lazyPage(
  () => import('./berry-flavors/BerryFlavorsPage'),
  'BerryFlavorsPage',
);
const BerriesPage = lazyPage(() => import('./berries/BerriesPage'), 'BerriesPage');
const BerryFlavorPotenciesPage = lazyPage(
  () => import('./berry-flavor-potencies/BerryFlavorPotenciesPage'),
  'BerryFlavorPotenciesPage',
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
const ItemGameIndicesPage = lazyPage(
  () => import('./item-game-indices/ItemGameIndicesPage'),
  'ItemGameIndicesPage',
);
const SkillAilmentsPage = lazyPage(
  () => import('./skill-ailments/SkillAilmentsPage'),
  'SkillAilmentsPage',
);
const SkillBattleStylesPage = lazyPage(
  () => import('./skill-battle-styles/SkillBattleStylesPage'),
  'SkillBattleStylesPage',
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
const SkillContestCombosPage = lazyPage(
  () => import('./skill-contest-combos/SkillContestCombosPage'),
  'SkillContestCombosPage',
);
const GrowthRatesPage = lazyPage(() => import('./growth-rates/GrowthRatesPage'), 'GrowthRatesPage');
const GrowthRateLevelsPage = lazyPage(
  () => import('./growth-rate-levels/GrowthRateLevelsPage'),
  'GrowthRateLevelsPage',
);
const EventStatsPage = lazyPage(() => import('./event-stats/EventStatsPage'), 'EventStatsPage');
const NaturesPage = lazyPage(() => import('./natures/NaturesPage'), 'NaturesPage');
const NatureBattleStylePreferencesPage = lazyPage(
  () => import('./nature-battle-style-preferences/NatureBattleStylePreferencesPage'),
  'NatureBattleStylePreferencesPage',
);
const NatureEventStatChangesPage = lazyPage(
  () => import('./nature-event-stat-changes/NatureEventStatChangesPage'),
  'NatureEventStatChangesPage',
);
const EventStatNatureEffectsPage = lazyPage(
  () => import('./event-stat-nature-effects/EventStatNatureEffectsPage'),
  'EventStatNatureEffectsPage',
);
const RegionsPage = lazyPage(() => import('./regions/RegionsPage'), 'RegionsPage');
const LocationsPage = lazyPage(() => import('./locations/LocationsPage'), 'LocationsPage');
const LocationGameIndicesPage = lazyPage(
  () => import('./location-game-indices/LocationGameIndicesPage'),
  'LocationGameIndicesPage',
);
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
const GenderSpeciesRatesPage = lazyPage(
  () => import('./gender-species-rates/GenderSpeciesRatesPage'),
  'GenderSpeciesRatesPage',
);
const GenderEvolutionRequirementsPage = lazyPage(
  () => import('./gender-evolution-requirements/GenderEvolutionRequirementsPage'),
  'GenderEvolutionRequirementsPage',
);
const CatalogsPage = lazyPage(() => import('./catalogs/CatalogsPage'), 'CatalogsPage');
const CatalogEntriesPage = lazyPage(
  () => import('./catalog-entries/CatalogEntriesPage'),
  'CatalogEntriesPage',
);
const CreatureFormsPage = lazyPage(
  () => import('./creature-forms/CreatureFormsPage'),
  'CreatureFormsPage',
);
const CreatureFormElementsPage = lazyPage(
  () => import('./creature-form-elements/CreatureFormElementsPage'),
  'CreatureFormElementsPage',
);
const MachinesPage = lazyPage(() => import('./machines/MachinesPage'), 'MachinesPage');
const TransferAreasPage = lazyPage(
  () => import('./transfer-areas/TransferAreasPage'),
  'TransferAreasPage',
);
const TransferAreaSpeciesPage = lazyPage(
  () => import('./transfer-area-species/TransferAreaSpeciesPage'),
  'TransferAreaSpeciesPage',
);
const AbilityDetailsPage = lazyPage(
  () => import('./ability-details/AbilityDetailsPage'),
  'AbilityDetailsPage',
);
const SpeciesDetailsPage = lazyPage(
  () => import('./species-details/SpeciesDetailsPage'),
  'SpeciesDetailsPage',
);
const SpeciesCatalogNumbersPage = lazyPage(
  () => import('./species-catalog-numbers/SpeciesCatalogNumbersPage'),
  'SpeciesCatalogNumbersPage',
);
const SpeciesCreatureVarietiesPage = lazyPage(
  () => import('./species-creature-varieties/SpeciesCreatureVarietiesPage'),
  'SpeciesCreatureVarietiesPage',
);
const CreatureSkillLearnsPage = lazyPage(
  () => import('./creature-skill-learns/CreatureSkillLearnsPage'),
  'CreatureSkillLearnsPage',
);
const CreatureHeldItemsPage = lazyPage(
  () => import('./creature-held-items/CreatureHeldItemsPage'),
  'CreatureHeldItemsPage',
);
const CreatureGameIndicesPage = lazyPage(
  () => import('./creature-game-indices/CreatureGameIndicesPage'),
  'CreatureGameIndicesPage',
);
const ElementDamageRelationsPage = lazyPage(
  () => import('./element-damage-relations/ElementDamageRelationsPage'),
  'ElementDamageRelationsPage',
);
const ElementGameIndicesPage = lazyPage(
  () => import('./element-game-indices/ElementGameIndicesPage'),
  'ElementGameIndicesPage',
);
const StatSkillEffectsPage = lazyPage(
  () => import('./stat-skill-effects/StatSkillEffectsPage'),
  'StatSkillEffectsPage',
);
const StatNatureEffectsPage = lazyPage(
  () => import('./stat-nature-effects/StatNatureEffectsPage'),
  'StatNatureEffectsPage',
);
const CharacteristicsPage = lazyPage(
  () => import('./characteristics/CharacteristicsPage'),
  'CharacteristicsPage',
);
const CharacteristicValuesPage = lazyPage(
  () => import('./characteristic-values/CharacteristicValuesPage'),
  'CharacteristicValuesPage',
);
const StatCharacteristicsPage = lazyPage(
  () => import('./stat-characteristics/StatCharacteristicsPage'),
  'StatCharacteristicsPage',
);

export const gameDataPageRoutes = [
  { path: 'creatures', element: <CreaturesPage /> },
  { path: 'species', element: <SpeciesPage /> },
  { path: 'skills', element: <SkillsPage /> },
  { path: 'abilities', element: <AbilitiesPage /> },
  { path: 'items', element: <ItemsPage /> },
  { path: 'elements', element: <ElementsPage /> },
  { path: 'stats', element: <StatsPage /> },
  { path: 'skill-damage-classes', element: <SkillDamageClassesPage /> },
  { path: 'item-categories', element: <ItemCategoriesPage /> },
  { path: 'species-colors', element: <SpeciesColorsPage /> },
  { path: 'species-shapes', element: <SpeciesShapesPage /> },
  { path: 'habitats', element: <HabitatsPage /> },
  { path: 'egg-groups', element: <EggGroupsPage /> },
  { path: 'species-egg-groups', element: <SpeciesEggGroupsPage /> },
  { path: 'creature-elements', element: <CreatureElementsPage /> },
  { path: 'creature-stats', element: <CreatureStatsPage /> },
  { path: 'creature-abilities', element: <CreatureAbilitiesPage /> },
  { path: 'contest-types', element: <ContestTypesPage /> },
  { path: 'contest-effects', element: <ContestEffectsPage /> },
  { path: 'advanced-contest-effects', element: <AdvancedContestEffectsPage /> },
  { path: 'advanced-contest-effect-skills', element: <AdvancedContestEffectSkillsPage /> },
  { path: 'berry-firmnesses', element: <BerryFirmnessesPage /> },
  { path: 'berry-flavors', element: <BerryFlavorsPage /> },
  { path: 'berries', element: <BerriesPage /> },
  { path: 'berry-flavor-potencies', element: <BerryFlavorPotenciesPage /> },
  { path: 'item-attributes', element: <ItemAttributesPage /> },
  { path: 'item-fling-effects', element: <ItemFlingEffectsPage /> },
  { path: 'item-pockets', element: <ItemPocketsPage /> },
  { path: 'item-details', element: <ItemDetailsPage /> },
  { path: 'item-attribute-bindings', element: <ItemAttributeBindingsPage /> },
  { path: 'item-category-pockets', element: <ItemCategoryPocketsPage /> },
  { path: 'item-game-indices', element: <ItemGameIndicesPage /> },
  { path: 'skill-ailments', element: <SkillAilmentsPage /> },
  { path: 'skill-battle-styles', element: <SkillBattleStylesPage /> },
  { path: 'skill-categories', element: <SkillCategoriesPage /> },
  { path: 'skill-learn-methods', element: <SkillLearnMethodsPage /> },
  { path: 'skill-targets', element: <SkillTargetsPage /> },
  { path: 'skill-details', element: <SkillDetailsPage /> },
  { path: 'skill-stat-changes', element: <SkillStatChangesPage /> },
  { path: 'skill-contest-combos', element: <SkillContestCombosPage /> },
  { path: 'growth-rates', element: <GrowthRatesPage /> },
  { path: 'growth-rate-levels', element: <GrowthRateLevelsPage /> },
  { path: 'event-stats', element: <EventStatsPage /> },
  { path: 'natures', element: <NaturesPage /> },
  { path: 'nature-battle-style-preferences', element: <NatureBattleStylePreferencesPage /> },
  { path: 'nature-event-stat-changes', element: <NatureEventStatChangesPage /> },
  { path: 'event-stat-nature-effects', element: <EventStatNatureEffectsPage /> },
  { path: 'regions', element: <RegionsPage /> },
  { path: 'locations', element: <LocationsPage /> },
  { path: 'location-game-indices', element: <LocationGameIndicesPage /> },
  { path: 'encounter-methods', element: <EncounterMethodsPage /> },
  { path: 'encounter-conditions', element: <EncounterConditionsPage /> },
  { path: 'encounter-condition-values', element: <EncounterConditionValuesPage /> },
  { path: 'location-areas', element: <LocationAreasPage /> },
  { path: 'location-area-method-rates', element: <LocationAreaMethodRatesPage /> },
  { path: 'location-area-encounters', element: <LocationAreaEncountersPage /> },
  {
    path: 'location-area-encounter-condition-values',
    element: <LocationAreaEncounterConditionValuesPage />,
  },
  { path: 'genders', element: <GendersPage /> },
  { path: 'evolution-triggers', element: <EvolutionTriggersPage /> },
  { path: 'evolution-chains', element: <EvolutionChainsPage /> },
  { path: 'evolution-nodes', element: <EvolutionNodesPage /> },
  { path: 'evolution-details', element: <EvolutionDetailsPage /> },
  { path: 'gender-species-rates', element: <GenderSpeciesRatesPage /> },
  { path: 'gender-evolution-requirements', element: <GenderEvolutionRequirementsPage /> },
  { path: 'catalogs', element: <CatalogsPage /> },
  { path: 'catalog-entries', element: <CatalogEntriesPage /> },
  { path: 'creature-forms', element: <CreatureFormsPage /> },
  { path: 'creature-form-elements', element: <CreatureFormElementsPage /> },
  { path: 'machines', element: <MachinesPage /> },
  { path: 'transfer-areas', element: <TransferAreasPage /> },
  { path: 'transfer-area-species', element: <TransferAreaSpeciesPage /> },
  { path: 'ability-details', element: <AbilityDetailsPage /> },
  { path: 'species-details', element: <SpeciesDetailsPage /> },
  { path: 'species-catalog-numbers', element: <SpeciesCatalogNumbersPage /> },
  { path: 'species-creature-varieties', element: <SpeciesCreatureVarietiesPage /> },
  { path: 'creature-skill-learns', element: <CreatureSkillLearnsPage /> },
  { path: 'creature-held-items', element: <CreatureHeldItemsPage /> },
  { path: 'creature-game-indices', element: <CreatureGameIndicesPage /> },
  { path: 'element-damage-relations', element: <ElementDamageRelationsPage /> },
  { path: 'element-game-indices', element: <ElementGameIndicesPage /> },
  { path: 'stat-skill-effects', element: <StatSkillEffectsPage /> },
  { path: 'stat-nature-effects', element: <StatNatureEffectsPage /> },
  { path: 'characteristics', element: <CharacteristicsPage /> },
  { path: 'characteristic-values', element: <CharacteristicValuesPage /> },
  { path: 'stat-characteristics', element: <StatCharacteristicsPage /> },
] satisfies readonly { path: GameDataResourceKey; element: ReactElement }[];
