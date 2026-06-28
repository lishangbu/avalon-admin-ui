import type { GameDataResourceKey, GameDataResourceService } from './shared';
import { creaturesGameDataService } from './creatures';
import { speciesGameDataService } from './species';
import { skillsGameDataService } from './skills';
import { abilitiesGameDataService } from './abilities';
import { itemsGameDataService } from './items';
import { elementsGameDataService } from './elements';
import { statsGameDataService } from './stats';
import { skillDamageClassesGameDataService } from './skill-damage-classes';
import { itemCategoriesGameDataService } from './item-categories';
import { speciesColorsGameDataService } from './species-colors';
import { speciesShapesGameDataService } from './species-shapes';
import { habitatsGameDataService } from './habitats';
import { eggGroupsGameDataService } from './egg-groups';
import { speciesEggGroupsGameDataService } from './species-egg-groups';
import { creatureElementsGameDataService } from './creature-elements';
import { creatureStatsGameDataService } from './creature-stats';
import { creatureAbilitiesGameDataService } from './creature-abilities';
import { contestTypesGameDataService } from './contest-types';
import { contestEffectsGameDataService } from './contest-effects';
import { advancedContestEffectsGameDataService } from './advanced-contest-effects';
import { advancedContestEffectSkillsGameDataService } from './advanced-contest-effect-skills';
import { berryFirmnessesGameDataService } from './berry-firmnesses';
import { berryFlavorsGameDataService } from './berry-flavors';
import { berriesGameDataService } from './berries';
import { berryFlavorPotenciesGameDataService } from './berry-flavor-potencies';
import { itemAttributesGameDataService } from './item-attributes';
import { itemFlingEffectsGameDataService } from './item-fling-effects';
import { itemPocketsGameDataService } from './item-pockets';
import { itemDetailsGameDataService } from './item-details';
import { itemAttributeBindingsGameDataService } from './item-attribute-bindings';
import { itemCategoryPocketsGameDataService } from './item-category-pockets';
import { itemGameIndicesGameDataService } from './item-game-indices';
import { skillAilmentsGameDataService } from './skill-ailments';
import { skillBattleStylesGameDataService } from './skill-battle-styles';
import { skillCategoriesGameDataService } from './skill-categories';
import { skillLearnMethodsGameDataService } from './skill-learn-methods';
import { skillTargetsGameDataService } from './skill-targets';
import { skillDetailsGameDataService } from './skill-details';
import { skillStatChangesGameDataService } from './skill-stat-changes';
import { skillContestCombosGameDataService } from './skill-contest-combos';
import { growthRatesGameDataService } from './growth-rates';
import { growthRateLevelsGameDataService } from './growth-rate-levels';
import { eventStatsGameDataService } from './event-stats';
import { naturesGameDataService } from './natures';
import { natureBattleStylePreferencesGameDataService } from './nature-battle-style-preferences';
import { natureEventStatChangesGameDataService } from './nature-event-stat-changes';
import { eventStatNatureEffectsGameDataService } from './event-stat-nature-effects';
import { regionsGameDataService } from './regions';
import { locationsGameDataService } from './locations';
import { locationGameIndicesGameDataService } from './location-game-indices';
import { encounterMethodsGameDataService } from './encounter-methods';
import { encounterConditionsGameDataService } from './encounter-conditions';
import { encounterConditionValuesGameDataService } from './encounter-condition-values';
import { locationAreasGameDataService } from './location-areas';
import { locationAreaMethodRatesGameDataService } from './location-area-method-rates';
import { locationAreaEncountersGameDataService } from './location-area-encounters';
import { locationAreaEncounterConditionValuesGameDataService } from './location-area-encounter-condition-values';
import { gendersGameDataService } from './genders';
import { evolutionTriggersGameDataService } from './evolution-triggers';
import { evolutionChainsGameDataService } from './evolution-chains';
import { evolutionNodesGameDataService } from './evolution-nodes';
import { evolutionDetailsGameDataService } from './evolution-details';
import { genderSpeciesRatesGameDataService } from './gender-species-rates';
import { genderEvolutionRequirementsGameDataService } from './gender-evolution-requirements';
import { catalogsGameDataService } from './catalogs';
import { catalogEntriesGameDataService } from './catalog-entries';
import { creatureFormsGameDataService } from './creature-forms';
import { creatureFormElementsGameDataService } from './creature-form-elements';
import { machinesGameDataService } from './machines';
import { transferAreasGameDataService } from './transfer-areas';
import { transferAreaSpeciesGameDataService } from './transfer-area-species';
import { abilityDetailsGameDataService } from './ability-details';
import { speciesDetailsGameDataService } from './species-details';
import { speciesCatalogNumbersGameDataService } from './species-catalog-numbers';
import { speciesCreatureVarietiesGameDataService } from './species-creature-varieties';
import { creatureSkillLearnsGameDataService } from './creature-skill-learns';
import { creatureHeldItemsGameDataService } from './creature-held-items';
import { creatureGameIndicesGameDataService } from './creature-game-indices';
import { elementDamageRelationsGameDataService } from './element-damage-relations';
import { elementGameIndicesGameDataService } from './element-game-indices';
import { statSkillEffectsGameDataService } from './stat-skill-effects';
import { statNatureEffectsGameDataService } from './stat-nature-effects';
import { characteristicsGameDataService } from './characteristics';
import { characteristicValuesGameDataService } from './characteristic-values';
import { statCharacteristicsGameDataService } from './stat-characteristics';

export type {
  ApiRequest,
  GameDataListQuery,
  GameDataPage,
  GameDataRecord,
  GameDataResourceKey,
  GameDataResourceService,
} from './shared';
export { createCreaturesGameDataService, creaturesGameDataService } from './creatures';
export { createSpeciesGameDataService, speciesGameDataService } from './species';
export { createSkillsGameDataService, skillsGameDataService } from './skills';
export { createAbilitiesGameDataService, abilitiesGameDataService } from './abilities';
export { createItemsGameDataService, itemsGameDataService } from './items';
export { createElementsGameDataService, elementsGameDataService } from './elements';
export { createStatsGameDataService, statsGameDataService } from './stats';
export {
  createSkillDamageClassesGameDataService,
  skillDamageClassesGameDataService,
} from './skill-damage-classes';
export {
  createItemCategoriesGameDataService,
  itemCategoriesGameDataService,
} from './item-categories';
export { createSpeciesColorsGameDataService, speciesColorsGameDataService } from './species-colors';
export { createSpeciesShapesGameDataService, speciesShapesGameDataService } from './species-shapes';
export { createHabitatsGameDataService, habitatsGameDataService } from './habitats';
export { createEggGroupsGameDataService, eggGroupsGameDataService } from './egg-groups';
export {
  createSpeciesEggGroupsGameDataService,
  speciesEggGroupsGameDataService,
} from './species-egg-groups';
export {
  createCreatureElementsGameDataService,
  creatureElementsGameDataService,
} from './creature-elements';
export { createCreatureStatsGameDataService, creatureStatsGameDataService } from './creature-stats';
export {
  createCreatureAbilitiesGameDataService,
  creatureAbilitiesGameDataService,
} from './creature-abilities';
export { createContestTypesGameDataService, contestTypesGameDataService } from './contest-types';
export {
  createContestEffectsGameDataService,
  contestEffectsGameDataService,
} from './contest-effects';
export {
  createAdvancedContestEffectsGameDataService,
  advancedContestEffectsGameDataService,
} from './advanced-contest-effects';
export {
  createAdvancedContestEffectSkillsGameDataService,
  advancedContestEffectSkillsGameDataService,
} from './advanced-contest-effect-skills';
export {
  createBerryFirmnessesGameDataService,
  berryFirmnessesGameDataService,
} from './berry-firmnesses';
export { createBerryFlavorsGameDataService, berryFlavorsGameDataService } from './berry-flavors';
export { createBerriesGameDataService, berriesGameDataService } from './berries';
export {
  createBerryFlavorPotenciesGameDataService,
  berryFlavorPotenciesGameDataService,
} from './berry-flavor-potencies';
export {
  createItemAttributesGameDataService,
  itemAttributesGameDataService,
} from './item-attributes';
export {
  createItemFlingEffectsGameDataService,
  itemFlingEffectsGameDataService,
} from './item-fling-effects';
export { createItemPocketsGameDataService, itemPocketsGameDataService } from './item-pockets';
export { createItemDetailsGameDataService, itemDetailsGameDataService } from './item-details';
export {
  createItemAttributeBindingsGameDataService,
  itemAttributeBindingsGameDataService,
} from './item-attribute-bindings';
export {
  createItemCategoryPocketsGameDataService,
  itemCategoryPocketsGameDataService,
} from './item-category-pockets';
export {
  createItemGameIndicesGameDataService,
  itemGameIndicesGameDataService,
} from './item-game-indices';
export { createSkillAilmentsGameDataService, skillAilmentsGameDataService } from './skill-ailments';
export {
  createSkillBattleStylesGameDataService,
  skillBattleStylesGameDataService,
} from './skill-battle-styles';
export {
  createSkillCategoriesGameDataService,
  skillCategoriesGameDataService,
} from './skill-categories';
export {
  createSkillLearnMethodsGameDataService,
  skillLearnMethodsGameDataService,
} from './skill-learn-methods';
export { createSkillTargetsGameDataService, skillTargetsGameDataService } from './skill-targets';
export { createSkillDetailsGameDataService, skillDetailsGameDataService } from './skill-details';
export {
  createSkillStatChangesGameDataService,
  skillStatChangesGameDataService,
} from './skill-stat-changes';
export {
  createSkillContestCombosGameDataService,
  skillContestCombosGameDataService,
} from './skill-contest-combos';
export { createGrowthRatesGameDataService, growthRatesGameDataService } from './growth-rates';
export {
  createGrowthRateLevelsGameDataService,
  growthRateLevelsGameDataService,
} from './growth-rate-levels';
export { createEventStatsGameDataService, eventStatsGameDataService } from './event-stats';
export { createNaturesGameDataService, naturesGameDataService } from './natures';
export {
  createNatureBattleStylePreferencesGameDataService,
  natureBattleStylePreferencesGameDataService,
} from './nature-battle-style-preferences';
export {
  createNatureEventStatChangesGameDataService,
  natureEventStatChangesGameDataService,
} from './nature-event-stat-changes';
export {
  createEventStatNatureEffectsGameDataService,
  eventStatNatureEffectsGameDataService,
} from './event-stat-nature-effects';
export { createRegionsGameDataService, regionsGameDataService } from './regions';
export { createLocationsGameDataService, locationsGameDataService } from './locations';
export {
  createLocationGameIndicesGameDataService,
  locationGameIndicesGameDataService,
} from './location-game-indices';
export {
  createEncounterMethodsGameDataService,
  encounterMethodsGameDataService,
} from './encounter-methods';
export {
  createEncounterConditionsGameDataService,
  encounterConditionsGameDataService,
} from './encounter-conditions';
export {
  createEncounterConditionValuesGameDataService,
  encounterConditionValuesGameDataService,
} from './encounter-condition-values';
export { createLocationAreasGameDataService, locationAreasGameDataService } from './location-areas';
export {
  createLocationAreaMethodRatesGameDataService,
  locationAreaMethodRatesGameDataService,
} from './location-area-method-rates';
export {
  createLocationAreaEncountersGameDataService,
  locationAreaEncountersGameDataService,
} from './location-area-encounters';
export {
  createLocationAreaEncounterConditionValuesGameDataService,
  locationAreaEncounterConditionValuesGameDataService,
} from './location-area-encounter-condition-values';
export { createGendersGameDataService, gendersGameDataService } from './genders';
export {
  createEvolutionTriggersGameDataService,
  evolutionTriggersGameDataService,
} from './evolution-triggers';
export {
  createEvolutionChainsGameDataService,
  evolutionChainsGameDataService,
} from './evolution-chains';
export {
  createEvolutionNodesGameDataService,
  evolutionNodesGameDataService,
} from './evolution-nodes';
export {
  createEvolutionDetailsGameDataService,
  evolutionDetailsGameDataService,
} from './evolution-details';
export {
  createGenderSpeciesRatesGameDataService,
  genderSpeciesRatesGameDataService,
} from './gender-species-rates';
export {
  createGenderEvolutionRequirementsGameDataService,
  genderEvolutionRequirementsGameDataService,
} from './gender-evolution-requirements';
export { createCatalogsGameDataService, catalogsGameDataService } from './catalogs';
export {
  createCatalogEntriesGameDataService,
  catalogEntriesGameDataService,
} from './catalog-entries';
export { createCreatureFormsGameDataService, creatureFormsGameDataService } from './creature-forms';
export {
  createCreatureFormElementsGameDataService,
  creatureFormElementsGameDataService,
} from './creature-form-elements';
export { createMachinesGameDataService, machinesGameDataService } from './machines';
export { createTransferAreasGameDataService, transferAreasGameDataService } from './transfer-areas';
export {
  createTransferAreaSpeciesGameDataService,
  transferAreaSpeciesGameDataService,
} from './transfer-area-species';
export {
  createAbilityDetailsGameDataService,
  abilityDetailsGameDataService,
} from './ability-details';
export {
  createSpeciesDetailsGameDataService,
  speciesDetailsGameDataService,
} from './species-details';
export {
  createSpeciesCatalogNumbersGameDataService,
  speciesCatalogNumbersGameDataService,
} from './species-catalog-numbers';
export {
  createSpeciesCreatureVarietiesGameDataService,
  speciesCreatureVarietiesGameDataService,
} from './species-creature-varieties';
export {
  createCreatureSkillLearnsGameDataService,
  creatureSkillLearnsGameDataService,
} from './creature-skill-learns';
export {
  createCreatureHeldItemsGameDataService,
  creatureHeldItemsGameDataService,
} from './creature-held-items';
export {
  createCreatureGameIndicesGameDataService,
  creatureGameIndicesGameDataService,
} from './creature-game-indices';
export {
  createElementDamageRelationsGameDataService,
  elementDamageRelationsGameDataService,
} from './element-damage-relations';
export {
  createElementGameIndicesGameDataService,
  elementGameIndicesGameDataService,
} from './element-game-indices';
export {
  createStatSkillEffectsGameDataService,
  statSkillEffectsGameDataService,
} from './stat-skill-effects';
export {
  createStatNatureEffectsGameDataService,
  statNatureEffectsGameDataService,
} from './stat-nature-effects';
export {
  createCharacteristicsGameDataService,
  characteristicsGameDataService,
} from './characteristics';
export {
  createCharacteristicValuesGameDataService,
  characteristicValuesGameDataService,
} from './characteristic-values';
export {
  createStatCharacteristicsGameDataService,
  statCharacteristicsGameDataService,
} from './stat-characteristics';

export const gameDataReferenceServices = {
  creatures: creaturesGameDataService,
  species: speciesGameDataService,
  skills: skillsGameDataService,
  abilities: abilitiesGameDataService,
  items: itemsGameDataService,
  elements: elementsGameDataService,
  stats: statsGameDataService,
  'skill-damage-classes': skillDamageClassesGameDataService,
  'item-categories': itemCategoriesGameDataService,
  'species-colors': speciesColorsGameDataService,
  'species-shapes': speciesShapesGameDataService,
  habitats: habitatsGameDataService,
  'egg-groups': eggGroupsGameDataService,
  'species-egg-groups': speciesEggGroupsGameDataService,
  'creature-elements': creatureElementsGameDataService,
  'creature-stats': creatureStatsGameDataService,
  'creature-abilities': creatureAbilitiesGameDataService,
  'contest-types': contestTypesGameDataService,
  'contest-effects': contestEffectsGameDataService,
  'advanced-contest-effects': advancedContestEffectsGameDataService,
  'advanced-contest-effect-skills': advancedContestEffectSkillsGameDataService,
  'berry-firmnesses': berryFirmnessesGameDataService,
  'berry-flavors': berryFlavorsGameDataService,
  berries: berriesGameDataService,
  'berry-flavor-potencies': berryFlavorPotenciesGameDataService,
  'item-attributes': itemAttributesGameDataService,
  'item-fling-effects': itemFlingEffectsGameDataService,
  'item-pockets': itemPocketsGameDataService,
  'item-details': itemDetailsGameDataService,
  'item-attribute-bindings': itemAttributeBindingsGameDataService,
  'item-category-pockets': itemCategoryPocketsGameDataService,
  'item-game-indices': itemGameIndicesGameDataService,
  'skill-ailments': skillAilmentsGameDataService,
  'skill-battle-styles': skillBattleStylesGameDataService,
  'skill-categories': skillCategoriesGameDataService,
  'skill-learn-methods': skillLearnMethodsGameDataService,
  'skill-targets': skillTargetsGameDataService,
  'skill-details': skillDetailsGameDataService,
  'skill-stat-changes': skillStatChangesGameDataService,
  'skill-contest-combos': skillContestCombosGameDataService,
  'growth-rates': growthRatesGameDataService,
  'growth-rate-levels': growthRateLevelsGameDataService,
  'event-stats': eventStatsGameDataService,
  natures: naturesGameDataService,
  'nature-battle-style-preferences': natureBattleStylePreferencesGameDataService,
  'nature-event-stat-changes': natureEventStatChangesGameDataService,
  'event-stat-nature-effects': eventStatNatureEffectsGameDataService,
  regions: regionsGameDataService,
  locations: locationsGameDataService,
  'location-game-indices': locationGameIndicesGameDataService,
  'encounter-methods': encounterMethodsGameDataService,
  'encounter-conditions': encounterConditionsGameDataService,
  'encounter-condition-values': encounterConditionValuesGameDataService,
  'location-areas': locationAreasGameDataService,
  'location-area-method-rates': locationAreaMethodRatesGameDataService,
  'location-area-encounters': locationAreaEncountersGameDataService,
  'location-area-encounter-condition-values': locationAreaEncounterConditionValuesGameDataService,
  genders: gendersGameDataService,
  'evolution-triggers': evolutionTriggersGameDataService,
  'evolution-chains': evolutionChainsGameDataService,
  'evolution-nodes': evolutionNodesGameDataService,
  'evolution-details': evolutionDetailsGameDataService,
  'gender-species-rates': genderSpeciesRatesGameDataService,
  'gender-evolution-requirements': genderEvolutionRequirementsGameDataService,
  catalogs: catalogsGameDataService,
  'catalog-entries': catalogEntriesGameDataService,
  'creature-forms': creatureFormsGameDataService,
  'creature-form-elements': creatureFormElementsGameDataService,
  machines: machinesGameDataService,
  'transfer-areas': transferAreasGameDataService,
  'transfer-area-species': transferAreaSpeciesGameDataService,
  'ability-details': abilityDetailsGameDataService,
  'species-details': speciesDetailsGameDataService,
  'species-catalog-numbers': speciesCatalogNumbersGameDataService,
  'species-creature-varieties': speciesCreatureVarietiesGameDataService,
  'creature-skill-learns': creatureSkillLearnsGameDataService,
  'creature-held-items': creatureHeldItemsGameDataService,
  'creature-game-indices': creatureGameIndicesGameDataService,
  'element-damage-relations': elementDamageRelationsGameDataService,
  'element-game-indices': elementGameIndicesGameDataService,
  'stat-skill-effects': statSkillEffectsGameDataService,
  'stat-nature-effects': statNatureEffectsGameDataService,
  characteristics: characteristicsGameDataService,
  'characteristic-values': characteristicValuesGameDataService,
  'stat-characteristics': statCharacteristicsGameDataService,
} satisfies Record<GameDataResourceKey, GameDataResourceService>;

export function getGameDataReferenceService(
  resource: GameDataResourceKey,
): GameDataResourceService {
  return gameDataReferenceServices[resource];
}
