import type { RouteMeta } from '../../app/layout/menu';
import type { GameDataResourceKey } from '../../services/game-data';
import { creaturesResource } from './creatures/CreaturesPage';
import { speciesResource } from './species/SpeciesPage';
import { skillsResource } from './skills/SkillsPage';
import { abilitiesResource } from './abilities/AbilitiesPage';
import { itemsResource } from './items/ItemsPage';
import { elementsResource } from './elements/ElementsPage';
import { statsResource } from './stats/StatsPage';
import { skillDamageClassesResource } from './skill-damage-classes/SkillDamageClassesPage';
import { itemCategoriesResource } from './item-categories/ItemCategoriesPage';
import { speciesColorsResource } from './species-colors/SpeciesColorsPage';
import { speciesShapesResource } from './species-shapes/SpeciesShapesPage';
import { habitatsResource } from './habitats/HabitatsPage';
import { eggGroupsResource } from './egg-groups/EggGroupsPage';
import { speciesEggGroupsResource } from './species-egg-groups/SpeciesEggGroupsPage';
import { creatureElementsResource } from './creature-elements/CreatureElementsPage';
import { creatureStatsResource } from './creature-stats/CreatureStatsPage';
import { creatureAbilitiesResource } from './creature-abilities/CreatureAbilitiesPage';
import { contestTypesResource } from './contest-types/ContestTypesPage';
import { contestEffectsResource } from './contest-effects/ContestEffectsPage';
import { advancedContestEffectsResource } from './advanced-contest-effects/AdvancedContestEffectsPage';
import { advancedContestEffectSkillsResource } from './advanced-contest-effect-skills/AdvancedContestEffectSkillsPage';
import { berryFirmnessesResource } from './berry-firmnesses/BerryFirmnessesPage';
import { berryFlavorsResource } from './berry-flavors/BerryFlavorsPage';
import { berriesResource } from './berries/BerriesPage';
import { berryFlavorPotenciesResource } from './berry-flavor-potencies/BerryFlavorPotenciesPage';
import { itemAttributesResource } from './item-attributes/ItemAttributesPage';
import { itemFlingEffectsResource } from './item-fling-effects/ItemFlingEffectsPage';
import { itemPocketsResource } from './item-pockets/ItemPocketsPage';
import { itemDetailsResource } from './item-details/ItemDetailsPage';
import { itemAttributeBindingsResource } from './item-attribute-bindings/ItemAttributeBindingsPage';
import { itemCategoryPocketsResource } from './item-category-pockets/ItemCategoryPocketsPage';
import { itemGameIndicesResource } from './item-game-indices/ItemGameIndicesPage';
import { skillAilmentsResource } from './skill-ailments/SkillAilmentsPage';
import { skillBattleStylesResource } from './skill-battle-styles/SkillBattleStylesPage';
import { skillCategoriesResource } from './skill-categories/SkillCategoriesPage';
import { skillLearnMethodsResource } from './skill-learn-methods/SkillLearnMethodsPage';
import { skillTargetsResource } from './skill-targets/SkillTargetsPage';
import { skillDetailsResource } from './skill-details/SkillDetailsPage';
import { skillStatChangesResource } from './skill-stat-changes/SkillStatChangesPage';
import { skillContestCombosResource } from './skill-contest-combos/SkillContestCombosPage';
import { growthRatesResource } from './growth-rates/GrowthRatesPage';
import { growthRateLevelsResource } from './growth-rate-levels/GrowthRateLevelsPage';
import { eventStatsResource } from './event-stats/EventStatsPage';
import { naturesResource } from './natures/NaturesPage';
import { natureBattleStylePreferencesResource } from './nature-battle-style-preferences/NatureBattleStylePreferencesPage';
import { natureEventStatChangesResource } from './nature-event-stat-changes/NatureEventStatChangesPage';
import { eventStatNatureEffectsResource } from './event-stat-nature-effects/EventStatNatureEffectsPage';
import { regionsResource } from './regions/RegionsPage';
import { locationsResource } from './locations/LocationsPage';
import { locationGameIndicesResource } from './location-game-indices/LocationGameIndicesPage';
import { encounterMethodsResource } from './encounter-methods/EncounterMethodsPage';
import { encounterConditionsResource } from './encounter-conditions/EncounterConditionsPage';
import { encounterConditionValuesResource } from './encounter-condition-values/EncounterConditionValuesPage';
import { locationAreasResource } from './location-areas/LocationAreasPage';
import { locationAreaMethodRatesResource } from './location-area-method-rates/LocationAreaMethodRatesPage';
import { locationAreaEncountersResource } from './location-area-encounters/LocationAreaEncountersPage';
import { locationAreaEncounterConditionValuesResource } from './location-area-encounter-condition-values/LocationAreaEncounterConditionValuesPage';
import { gendersResource } from './genders/GendersPage';
import { evolutionTriggersResource } from './evolution-triggers/EvolutionTriggersPage';
import { evolutionChainsResource } from './evolution-chains/EvolutionChainsPage';
import { evolutionNodesResource } from './evolution-nodes/EvolutionNodesPage';
import { evolutionDetailsResource } from './evolution-details/EvolutionDetailsPage';
import { genderSpeciesRatesResource } from './gender-species-rates/GenderSpeciesRatesPage';
import { genderEvolutionRequirementsResource } from './gender-evolution-requirements/GenderEvolutionRequirementsPage';
import { catalogsResource } from './catalogs/CatalogsPage';
import { catalogEntriesResource } from './catalog-entries/CatalogEntriesPage';
import { creatureFormsResource } from './creature-forms/CreatureFormsPage';
import { creatureFormElementsResource } from './creature-form-elements/CreatureFormElementsPage';
import { machinesResource } from './machines/MachinesPage';
import { transferAreasResource } from './transfer-areas/TransferAreasPage';
import { transferAreaSpeciesResource } from './transfer-area-species/TransferAreaSpeciesPage';
import { abilityDetailsResource } from './ability-details/AbilityDetailsPage';
import { speciesDetailsResource } from './species-details/SpeciesDetailsPage';
import { speciesCatalogNumbersResource } from './species-catalog-numbers/SpeciesCatalogNumbersPage';
import { speciesCreatureVarietiesResource } from './species-creature-varieties/SpeciesCreatureVarietiesPage';
import { creatureSkillLearnsResource } from './creature-skill-learns/CreatureSkillLearnsPage';
import { creatureHeldItemsResource } from './creature-held-items/CreatureHeldItemsPage';
import { creatureGameIndicesResource } from './creature-game-indices/CreatureGameIndicesPage';
import { elementDamageRelationsResource } from './element-damage-relations/ElementDamageRelationsPage';
import { elementGameIndicesResource } from './element-game-indices/ElementGameIndicesPage';
import { statSkillEffectsResource } from './stat-skill-effects/StatSkillEffectsPage';
import { statNatureEffectsResource } from './stat-nature-effects/StatNatureEffectsPage';
import { characteristicsResource } from './characteristics/CharacteristicsPage';
import { characteristicValuesResource } from './characteristic-values/CharacteristicValuesPage';
import { statCharacteristicsResource } from './stat-characteristics/StatCharacteristicsPage';

export type GameDataFieldType = 'string' | 'int' | 'long' | 'boolean';

export interface GameDataReferenceConfig {
  resource: GameDataResourceKey;
  labelField?: string;
  codeField?: string;
  displayFields?: string[];
}

export interface GameDataFieldConfig {
  name: string;
  label: string;
  type: GameDataFieldType;
  required?: boolean;
  maxLength?: number;
  width?: number;
  defaultValue?: unknown;
  reference?: GameDataReferenceConfig;
  filter?: boolean;
}

export interface GameDataResourceConfig {
  key: GameDataResourceKey;
  path: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  displayFields?: string[];
  fields: GameDataFieldConfig[];
}

export const gameDataResources: GameDataResourceConfig[] = [
  creaturesResource,
  speciesResource,
  skillsResource,
  abilitiesResource,
  itemsResource,
  elementsResource,
  statsResource,
  skillDamageClassesResource,
  itemCategoriesResource,
  speciesColorsResource,
  speciesShapesResource,
  habitatsResource,
  eggGroupsResource,
  speciesEggGroupsResource,
  creatureElementsResource,
  creatureStatsResource,
  creatureAbilitiesResource,
  contestTypesResource,
  contestEffectsResource,
  advancedContestEffectsResource,
  advancedContestEffectSkillsResource,
  berryFirmnessesResource,
  berryFlavorsResource,
  berriesResource,
  berryFlavorPotenciesResource,
  itemAttributesResource,
  itemFlingEffectsResource,
  itemPocketsResource,
  itemDetailsResource,
  itemAttributeBindingsResource,
  itemCategoryPocketsResource,
  itemGameIndicesResource,
  skillAilmentsResource,
  skillBattleStylesResource,
  skillCategoriesResource,
  skillLearnMethodsResource,
  skillTargetsResource,
  skillDetailsResource,
  skillStatChangesResource,
  skillContestCombosResource,
  growthRatesResource,
  growthRateLevelsResource,
  eventStatsResource,
  naturesResource,
  natureBattleStylePreferencesResource,
  natureEventStatChangesResource,
  eventStatNatureEffectsResource,
  regionsResource,
  locationsResource,
  locationGameIndicesResource,
  encounterMethodsResource,
  encounterConditionsResource,
  encounterConditionValuesResource,
  locationAreasResource,
  locationAreaMethodRatesResource,
  locationAreaEncountersResource,
  locationAreaEncounterConditionValuesResource,
  gendersResource,
  evolutionTriggersResource,
  evolutionChainsResource,
  evolutionNodesResource,
  evolutionDetailsResource,
  genderSpeciesRatesResource,
  genderEvolutionRequirementsResource,
  catalogsResource,
  catalogEntriesResource,
  creatureFormsResource,
  creatureFormElementsResource,
  machinesResource,
  transferAreasResource,
  transferAreaSpeciesResource,
  abilityDetailsResource,
  speciesDetailsResource,
  speciesCatalogNumbersResource,
  speciesCreatureVarietiesResource,
  creatureSkillLearnsResource,
  creatureHeldItemsResource,
  creatureGameIndicesResource,
  elementDamageRelationsResource,
  elementGameIndicesResource,
  statSkillEffectsResource,
  statNatureEffectsResource,
  characteristicsResource,
  characteristicValuesResource,
  statCharacteristicsResource,
];

export const gameDataRouteMetas: RouteMeta[] = gameDataResources.map((resource) => ({
  path: resource.path,
  title: resource.title,
  componentKey: `game-data/${resource.key}`,
  accessCode: `game-data.${resource.key}`,
}));

export function findGameDataResource(resourceKey?: string): GameDataResourceConfig | undefined {
  return gameDataResources.find((resource) => resource.key === resourceKey);
}

export function mustFindGameDataResource(resourceKey: GameDataResourceKey): GameDataResourceConfig {
  const resource = findGameDataResource(resourceKey);
  if (!resource) {
    throw new Error(`未找到游戏资料资源配置: ${resourceKey}`);
  }
  return resource;
}
