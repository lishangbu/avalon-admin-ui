import type { RouteMeta } from '../../app/layout/menu';
import type { GameDataResourceKey } from '../../services/game-data/shared';

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

/**
 * 资料菜单只需要轻量路由元数据，不能再从各页面文件导入 resource 配置。
 * 页面文件会顺带导入表格、服务和字段引用；如果菜单层静态读取它们，首屏会提前加载全部资料维护页面，
 * 使 React.lazy 失去拆包意义。这里仅维护 key 与中文标题，path/componentKey/accessCode 由 key 统一推导。
 */
const gameDataRouteDefinitions = [
  ['creatures', '生物资料'],
  ['species', '种类资料'],
  ['skills', '技能资料'],
  ['abilities', '特性资料'],
  ['items', '道具资料'],
  ['elements', '属性资料'],
  ['stats', '数值项'],
  ['skill-damage-classes', '技能分类'],
  ['item-categories', '道具分类'],
  ['species-colors', '种类颜色'],
  ['species-shapes', '种类形态'],
  ['habitats', '栖息地'],
  ['egg-groups', '种类分组'],
  ['species-egg-groups', '种类分组绑定'],
  ['creature-elements', '生物属性绑定'],
  ['creature-stats', '生物数值绑定'],
  ['creature-abilities', '生物特性绑定'],
  ['contest-types', '评分类别'],
  ['contest-effects', '评价效果'],
  ['advanced-contest-effects', '高级评价效果'],
  ['advanced-contest-effect-skills', '高级评价效果技能'],
  ['berry-firmnesses', '树果硬度'],
  ['berry-flavors', '树果口味'],
  ['berries', '树果资料'],
  ['berry-flavor-potencies', '树果口味强度'],
  ['item-attributes', '道具属性'],
  ['item-fling-effects', '道具投掷效果'],
  ['item-pockets', '道具口袋'],
  ['item-details', '道具详情'],
  ['item-attribute-bindings', '道具属性绑定'],
  ['item-category-pockets', '道具分类口袋'],
  ['item-game-indices', '道具索引'],
  ['skill-ailments', '技能异常'],
  ['skill-battle-styles', '技能战斗风格'],
  ['skill-categories', '技能元分类'],
  ['skill-learn-methods', '技能学习方式'],
  ['skill-targets', '技能目标'],
  ['skill-details', '技能详情'],
  ['skill-stat-changes', '技能数值变化'],
  ['skill-contest-combos', '技能评价组合'],
  ['growth-rates', '成长速率'],
  ['growth-rate-levels', '成长等级经验'],
  ['event-stats', '活动能力项'],
  ['natures', '性格资料'],
  ['nature-battle-style-preferences', '性格战斗风格偏好'],
  ['nature-event-stat-changes', '性格活动能力变化'],
  ['event-stat-nature-effects', '活动能力性格影响'],
  ['regions', '地区资料'],
  ['locations', '地点资料'],
  ['location-game-indices', '地点索引'],
  ['encounter-methods', '遭遇方式'],
  ['encounter-conditions', '遭遇条件'],
  ['encounter-condition-values', '遭遇条件值'],
  ['location-areas', '地点区域'],
  ['location-area-method-rates', '区域遭遇方式概率'],
  ['location-area-encounters', '区域生物遭遇'],
  ['location-area-encounter-condition-values', '区域遭遇条件绑定'],
  ['genders', '性别资料'],
  ['evolution-triggers', '进化触发器'],
  ['evolution-chains', '进化链'],
  ['evolution-nodes', '进化链节点'],
  ['evolution-details', '进化条件'],
  ['gender-species-rates', '性别种类比例'],
  ['gender-evolution-requirements', '性别进化要求'],
  ['catalogs', '图鉴目录'],
  ['catalog-entries', '图鉴目录条目'],
  ['creature-forms', '生物形态'],
  ['creature-form-elements', '生物形态属性'],
  ['machines', '机器资料'],
  ['transfer-areas', '迁移区域'],
  ['transfer-area-species', '迁移区域种类'],
  ['ability-details', '特性详情'],
  ['species-details', '种类详情'],
  ['species-catalog-numbers', '种类目录编号'],
  ['species-creature-varieties', '种类生物变种'],
  ['creature-skill-learns', '生物技能学习'],
  ['creature-held-items', '生物持有道具'],
  ['creature-game-indices', '生物索引'],
  ['element-damage-relations', '属性克制关系'],
  ['element-game-indices', '属性索引'],
  ['stat-skill-effects', '数值项技能影响'],
  ['stat-nature-effects', '数值项性格影响'],
  ['characteristics', '个体特征'],
  ['characteristic-values', '个体特征取值'],
  ['stat-characteristics', '数值项特征'],
] as const satisfies readonly (readonly [GameDataResourceKey, string])[];

export const gameDataRouteMetas: RouteMeta[] = gameDataRouteDefinitions.map(([key, title]) => ({
  path: `/game-data/${key}`,
  title,
  componentKey: `game-data/${key}`,
  accessCode: `game-data.${key}`,
}));
