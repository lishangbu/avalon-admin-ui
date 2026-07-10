import type { GameDataResourceKey } from '../../services/game-data/shared';

/**
 * 没有 name/code 的资料表默认展示字段。
 *
 * 这些配置只服务于跨表引用展示；普通表格列仍由各页面自己的 fields 维护。
 */
export const gameDataDisplayFields: Partial<Record<GameDataResourceKey, string[]>> = {
  'ability-details': ['ability_id', 'short_effect'],
  'creature-abilities': ['creature_id', 'ability_id', 'slot_order'],
  'creature-elements': ['creature_id', 'element_id', 'slot_order'],
  'creature-form-elements': ['form_id', 'element_id', 'slot_order'],
  'creature-held-items': ['creature_id', 'item_id'],
  'creature-skill-learns': ['creature_id', 'skill_id'],
  'creature-stats': ['creature_id', 'stat_id', 'base_value'],
  'element-damage-relations': ['source_element_id', 'target_element_id', 'relation_type'],
  'evolution-chains': ['baby_trigger_item_id'],
  'evolution-details': ['from_species_id', 'to_species_id', 'trigger_id'],
  'evolution-nodes': ['chain_id', 'species_id', 'parent_species_id'],
  'item-attribute-bindings': ['item_id', 'attribute_id'],
  'item-category-pockets': ['category_id', 'pocket_id'],
  'item-details': ['item_id', 'short_effect'],
  'location-area-encounter-condition-values': ['encounter_id', 'condition_value_id'],
  'location-area-encounters': ['area_id', 'creature_id', 'method_id', 'min_level', 'max_level'],
  'location-area-method-rates': ['area_id', 'method_id', 'rate'],
  'skill-details': ['skill_id', 'short_effect'],
  'skill-stat-changes': ['skill_id', 'stat_id', 'change_value'],
  'species-details': ['species_id', 'genus'],
  'species-egg-groups': ['species_id', 'egg_group_id'],
};
