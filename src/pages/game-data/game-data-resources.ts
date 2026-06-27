import type { RouteMeta } from '../../app/layout/menu';
import type { GameDataResourceKey } from '../../services/game-data';

export type GameDataFieldType = 'string' | 'int' | 'long' | 'boolean';

export interface GameDataFieldConfig {
  name: string;
  label: string;
  type: GameDataFieldType;
  required?: boolean;
  width?: number;
  defaultValue?: unknown;
}

export interface GameDataResourceConfig {
  key: GameDataResourceKey;
  path: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  fields: GameDataFieldConfig[];
}

const codeField: GameDataFieldConfig = {
  name: 'code',
  label: '编码',
  type: 'string',
  required: true,
  width: 180,
};

const nameField: GameDataFieldConfig = {
  name: 'name',
  label: '名称',
  type: 'string',
  required: true,
  width: 180,
};

const sortOrderField: GameDataFieldConfig = {
  name: 'sort_order',
  label: '排序',
  type: 'int',
  required: true,
  width: 100,
};

const enabledField: GameDataFieldConfig = {
  name: 'enabled',
  label: '启用',
  type: 'boolean',
  defaultValue: true,
  width: 100,
};

const dictionaryFields = [codeField, nameField, sortOrderField, enabledField];

export const gameDataResources: GameDataResourceConfig[] = [
  {
    key: 'creatures',
    path: '/game-data/creatures',
    title: '生物资料',
    description: '维护生物条目的名称、所属种类、尺寸和基础经验。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      { name: 'species_id', label: '种类 ID', type: 'long', width: 120 },
      { name: 'height', label: '高度', type: 'int', width: 100 },
      { name: 'weight', label: '重量', type: 'int', width: 100 },
      { name: 'base_experience', label: '基础经验', type: 'int', width: 120 },
      { name: 'sort_order', label: '排序', type: 'int', width: 100 },
      { name: 'default_form', label: '默认形态', type: 'boolean', defaultValue: true, width: 120 },
      enabledField,
    ],
  },
  {
    key: 'species',
    path: '/game-data/species',
    title: '种类资料',
    description: '维护种类层面的颜色、形态、栖息地和基础参数。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      { name: 'color_id', label: '颜色 ID', type: 'long', width: 110 },
      { name: 'shape_id', label: '形态 ID', type: 'long', width: 110 },
      { name: 'habitat_id', label: '栖息地 ID', type: 'long', width: 120 },
      { name: 'gender_rate', label: '性别比例', type: 'int', width: 120 },
      { name: 'capture_rate', label: '捕获率', type: 'int', width: 110 },
      { name: 'base_happiness', label: '初始亲和度', type: 'int', width: 130 },
      { name: 'hatch_counter', label: '孵化计数', type: 'int', width: 120 },
      { name: 'baby', label: '幼体', type: 'boolean', defaultValue: false, width: 90 },
      { name: 'legendary', label: '传说级', type: 'boolean', defaultValue: false, width: 100 },
      { name: 'mythical', label: '幻级', type: 'boolean', defaultValue: false, width: 90 },
      enabledField,
    ],
  },
  {
    key: 'skills',
    path: '/game-data/skills',
    title: '技能资料',
    description: '维护技能的属性、分类、威力、命中和使用次数。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      { name: 'element_id', label: '属性 ID', type: 'long', width: 110 },
      { name: 'damage_class_id', label: '分类 ID', type: 'long', width: 110 },
      { name: 'accuracy', label: '命中', type: 'int', width: 90 },
      { name: 'power', label: '威力', type: 'int', width: 90 },
      { name: 'pp', label: 'PP', type: 'int', width: 90 },
      { name: 'priority', label: '优先级', type: 'int', defaultValue: 0, width: 100 },
      { name: 'effect_chance', label: '效果概率', type: 'int', width: 120 },
      enabledField,
    ],
  },
  {
    key: 'abilities',
    path: '/game-data/abilities',
    title: '特性资料',
    description: '维护可被生物引用的被动能力资料。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      { name: 'main_series', label: '主体资料', type: 'boolean', defaultValue: true, width: 120 },
      enabledField,
    ],
  },
  {
    key: 'items',
    path: '/game-data/items',
    title: '道具资料',
    description: '维护道具名称、分类、价格和投掷威力。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      { name: 'category_id', label: '分类 ID', type: 'long', width: 110 },
      { name: 'cost', label: '价格', type: 'int', defaultValue: 0, width: 100 },
      { name: 'fling_power', label: '投掷威力', type: 'int', width: 120 },
      enabledField,
    ],
  },
  {
    key: 'elements',
    path: '/game-data/elements',
    title: '属性资料',
    description: '维护属性字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'stats',
    path: '/game-data/stats',
    title: '数值项',
    description: '维护生命、攻击等基础数值项。',
    searchPlaceholder: '编码或名称',
    fields: [
      codeField,
      nameField,
      sortOrderField,
      { name: 'battle_only', label: '仅运行时', type: 'boolean', defaultValue: false, width: 120 },
      enabledField,
    ],
  },
  {
    key: 'skill-damage-classes',
    path: '/game-data/skill-damage-classes',
    title: '技能分类',
    description: '维护技能结算分类和说明。',
    searchPlaceholder: '编码、名称或说明',
    fields: [
      codeField,
      nameField,
      { name: 'description', label: '说明', type: 'string', width: 260 },
      sortOrderField,
      enabledField,
    ],
  },
  {
    key: 'item-categories',
    path: '/game-data/item-categories',
    title: '道具分类',
    description: '维护道具分类字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'species-colors',
    path: '/game-data/species-colors',
    title: '种类颜色',
    description: '维护种类主色字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'species-shapes',
    path: '/game-data/species-shapes',
    title: '种类形态',
    description: '维护种类外形轮廓字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'habitats',
    path: '/game-data/habitats',
    title: '栖息地',
    description: '维护常见环境字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'egg-groups',
    path: '/game-data/egg-groups',
    title: '种类分组',
    description: '维护繁育或生态分组字典。',
    searchPlaceholder: '编码或名称',
    fields: dictionaryFields,
  },
  {
    key: 'species-egg-groups',
    path: '/game-data/species-egg-groups',
    title: '种类分组绑定',
    description: '维护种类与分组的多对多关系。',
    searchPlaceholder: '种类 ID 或分组 ID',
    fields: [
      { name: 'species_id', label: '种类 ID', type: 'long', required: true, width: 120 },
      { name: 'egg_group_id', label: '分组 ID', type: 'long', required: true, width: 120 },
      { name: 'slot_order', label: '槽位', type: 'int', required: true, width: 100 },
    ],
  },
  {
    key: 'creature-elements',
    path: '/game-data/creature-elements',
    title: '生物属性绑定',
    description: '维护生物条目的属性槽位。',
    searchPlaceholder: '生物 ID 或属性 ID',
    fields: [
      { name: 'creature_id', label: '生物 ID', type: 'long', required: true, width: 120 },
      { name: 'element_id', label: '属性 ID', type: 'long', required: true, width: 120 },
      { name: 'slot_order', label: '槽位', type: 'int', required: true, width: 100 },
    ],
  },
  {
    key: 'creature-stats',
    path: '/game-data/creature-stats',
    title: '生物数值绑定',
    description: '维护生物基础数值和努力收益。',
    searchPlaceholder: '生物 ID 或数值项 ID',
    fields: [
      { name: 'creature_id', label: '生物 ID', type: 'long', required: true, width: 120 },
      { name: 'stat_id', label: '数值项 ID', type: 'long', required: true, width: 130 },
      { name: 'base_value', label: '基础值', type: 'int', required: true, width: 110 },
      { name: 'effort', label: '努力收益', type: 'int', defaultValue: 0, width: 120 },
    ],
  },
  {
    key: 'creature-abilities',
    path: '/game-data/creature-abilities',
    title: '生物特性绑定',
    description: '维护生物条目的特性槽位。',
    searchPlaceholder: '生物 ID 或特性 ID',
    fields: [
      { name: 'creature_id', label: '生物 ID', type: 'long', required: true, width: 120 },
      { name: 'ability_id', label: '特性 ID', type: 'long', required: true, width: 120 },
      { name: 'slot_order', label: '槽位', type: 'int', required: true, width: 100 },
      { name: 'hidden', label: '隐藏', type: 'boolean', defaultValue: false, width: 100 },
    ],
  },
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
