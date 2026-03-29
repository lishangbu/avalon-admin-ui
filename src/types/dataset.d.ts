/**
 * 通用主键类型
 *
 * 兼容后端返回数字 ID 和少数场景下的字符串 ID。
 */
declare type Id = string | number

/**
 * 可空主键类型
 *
 * 常用于查询条件或表单初始值。
 */
declare type NullableId = Id | null

/**
 * 属性(Type)实体
 */
declare interface Type {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 属性(Type)查询条件
 */
declare interface TypeQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 招式伤害类别(MoveDamageClass)实体
 */
declare interface MoveDamageClass {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 说明描述 */
  description?: string
}

/**
 * 招式伤害类别(MoveDamageClass)查询条件
 */
declare interface MoveDamageClassQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 说明描述（支持模糊匹配） */
  description?: string
}

/**
 * 属性(Stat)实体
 */
declare interface Stat {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 游戏侧索引 ID */
  gameIndex?: number | null
  /** 是否仅战斗属性 */
  battleOnly?: boolean | null
  /** 关联的伤害类别 */
  moveDamageClass?: MoveDamageClass | null
}

/**
 * 属性(Stat)查询条件
 */
declare interface StatQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 游戏侧索引 ID */
  gameIndex?: number | null
  /** 是否仅战斗属性 */
  battleOnly?: boolean | null
  /** 招式伤害类别 ID */
  moveDamageClassId?: NullableId
}

/**
 * 属性(Stat)表单模型
 */
declare interface StatFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 游戏侧索引 ID */
  gameIndex: number | null
  /** 是否仅战斗属性：`1` 表示是，`0` 表示否 */
  battleOnly: number | null
  /** 招式伤害类别 ID */
  moveDamageClassId: NullableId
}

/**
 * 树果坚硬度(BerryFirmness)实体
 */
declare interface BerryFirmness {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 树果坚硬度(BerryFirmness)查询条件
 */
declare interface BerryFirmnessQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 树果风味(BerryFlavor)实体
 */
declare interface BerryFlavor {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 树果风味(BerryFlavor)查询条件
 */
declare interface BerryFlavorQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 属性相克查询使用的属性视图
 */
declare interface TypeEffectivenessTypeView {
  /** 属性内部名称 */
  internalName: string
  /** 属性显示名称 */
  name: string
}

/**
 * 属性相克查询中的单个防守结果
 */
declare interface TypeEffectivenessMatchup {
  /** 防守属性 */
  defendingType: TypeEffectivenessTypeView
  /** 倍率；未配置时为 `null` */
  multiplier?: number | null
  /** 当前格子状态 */
  status?: 'configured' | 'missing'
}

/**
 * 属性相克查询结果
 */
declare interface TypeEffectivenessResult {
  /** 攻击属性 */
  attackingType: TypeEffectivenessTypeView
  /** 防守属性明细 */
  defendingTypes: TypeEffectivenessMatchup[]
  /** 最终倍率；任一格子未配置时为 `null` */
  finalMultiplier?: number | null
  /** 查询整体状态 */
  status?: 'complete' | 'incomplete'
  /** 对战效果等级 */
  effectiveness?:
    | 'immune'
    | 'not-very-effective'
    | 'normal-effective'
    | 'super-effective'
    | 'incomplete'
}

/**
 * 属性相克矩阵完整度
 */
declare interface TypeEffectivenessCompleteness {
  /** 理论应配置的格子数 */
  expectedPairs: number
  /** 已配置的格子数 */
  configuredPairs: number
  /** 未配置的格子数 */
  missingPairs: number
}

/**
 * 属性相克矩阵中的单个格子
 */
declare interface TypeEffectivenessCell {
  /** 防守属性 */
  defendingType: TypeEffectivenessTypeView
  /** 倍率；未配置时为 `null` */
  multiplier?: number | null
  /** 当前格子状态 */
  status?: 'configured' | 'missing'
}

/**
 * 属性相克矩阵中的单行
 */
declare interface TypeEffectivenessRow {
  /** 攻击属性 */
  attackingType: TypeEffectivenessTypeView
  /** 行内所有格子 */
  cells: TypeEffectivenessCell[]
}

/**
 * 完整属性相克矩阵
 */
declare interface TypeEffectivenessChart {
  /** 前端允许展示和编辑的属性集合 */
  supportedTypes: TypeEffectivenessTypeView[]
  /** 矩阵完整度 */
  completeness: TypeEffectivenessCompleteness
  /** 按攻击属性分组的矩阵行 */
  rows: TypeEffectivenessRow[]
}

/**
 * 批量更新矩阵时的单个格子输入
 */
declare interface TypeEffectivenessMatrixCellInput {
  /** 攻击属性内部名称 */
  attackingType: string
  /** 防守属性内部名称 */
  defendingType: string
  /** 倍率；传 `null` 表示删除配置 */
  multiplier?: number | null
}

/**
 * 批量更新矩阵命令
 */
declare interface UpsertTypeEffectivenessMatrixCommand {
  /** 待变更的格子列表 */
  cells: TypeEffectivenessMatrixCellInput[]
}

/**
 * 树果(Berry)实体
 */
declare interface Berry {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 生长时间（小时） */
  growthTime?: number | null
  /** 最大结果数 */
  maxHarvest?: number | null
  /** 大小（毫米） */
  bulk?: number | null
  /** 光滑度 */
  smoothness?: number | null
  /** 土壤干燥速度 */
  soilDryness?: number | null
  /** 树果坚硬度 */
  berryFirmness?: BerryFirmness | null
  /** 自然之恩属性 */
  naturalGiftType?: Type | null
  /** 自然之恩威力 */
  naturalGiftPower?: number | null
}

/**
 * 树果(Berry)查询条件
 */
declare interface BerryQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 树果坚硬度 ID */
  berryFirmnessId?: NullableId
  /** 自然之恩属性 ID */
  naturalGiftTypeId?: NullableId
}

/**
 * 树果(Berry)表单模型
 */
declare interface BerryFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 生长时间（小时） */
  growthTime: number | null
  /** 最大结果数 */
  maxHarvest: number | null
  /** 大小（毫米） */
  bulk: number | null
  /** 光滑度 */
  smoothness: number | null
  /** 土壤干燥速度 */
  soilDryness: number | null
  /** 树果坚硬度 ID */
  berryFirmnessId: NullableId
  /** 自然之恩属性 ID */
  naturalGiftTypeId: NullableId
  /** 自然之恩威力 */
  naturalGiftPower: number | null
}

/**
 * 特性(Ability)实体
 */
declare interface Ability {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 效果描述 */
  effect?: string
  /** 中文介绍 */
  introduction?: string
}

/**
 * 特性(Ability)查询条件
 */
declare interface AbilityQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 效果描述（支持模糊匹配） */
  effect?: string
  /** 中文介绍（支持模糊匹配） */
  introduction?: string
}

/**
 * 特性(Ability)表单模型
 */
declare interface AbilityFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 效果描述 */
  effect: string
  /** 中文介绍 */
  introduction: string
}

/**
 * 蛋组(EggGroup)实体
 */
declare interface EggGroup {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 简要说明 */
  text?: string
  /** 详细特征 */
  characteristics?: string
}

/**
 * 蛋组(EggGroup)查询条件
 */
declare interface EggGroupQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 简要说明（支持模糊匹配） */
  text?: string
  /** 详细特征（支持模糊匹配） */
  characteristics?: string
}

/**
 * 蛋组(EggGroup)表单模型
 */
declare interface EggGroupFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 简要说明 */
  text: string
  /** 详细特征 */
  characteristics: string
}

/**
 * 性别(Gender)实体
 */
declare interface Gender {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 性别(Gender)查询条件
 */
declare interface GenderQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 性别(Gender)表单模型
 */
declare interface GenderFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 成长速度(GrowthRate)实体
 */
declare interface GrowthRate {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 描述 */
  description?: string
}

/**
 * 成长速度(GrowthRate)查询条件
 */
declare interface GrowthRateQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 描述（支持模糊匹配） */
  description?: string
}

/**
 * 成长速度(GrowthRate)表单模型
 */
declare interface GrowthRateFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 描述 */
  description: string
}

/**
 * 性格(Nature)实体
 */
declare interface Nature {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 降低的能力 */
  decreasedStat?: Stat | null
  /** 提高的能力 */
  increasedStat?: Stat | null
  /** 讨厌的树果风味 */
  hatesBerryFlavor?: BerryFlavor | null
  /** 喜欢的树果风味 */
  likesBerryFlavor?: BerryFlavor | null
}

/**
 * 性格(Nature)查询条件
 */
declare interface NatureQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 降低能力 ID */
  decreasedStatId?: NullableId
  /** 提高能力 ID */
  increasedStatId?: NullableId
  /** 讨厌风味 ID */
  hatesBerryFlavorId?: NullableId
  /** 喜欢风味 ID */
  likesBerryFlavorId?: NullableId
}

/**
 * 性格(Nature)表单模型
 */
declare interface NatureFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 降低能力 ID */
  decreasedStatId: NullableId
  /** 提高能力 ID */
  increasedStatId: NullableId
  /** 讨厌风味 ID */
  hatesBerryFlavorId: NullableId
  /** 喜欢风味 ID */
  likesBerryFlavorId: NullableId
}

/**
 * 遭遇条件(EncounterCondition)实体
 */
declare interface EncounterCondition {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 遭遇条件(EncounterCondition)查询条件
 */
declare interface EncounterConditionQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 遭遇条件(EncounterCondition)表单模型
 */
declare interface EncounterConditionFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 遭遇条件值(EncounterConditionValue)实体
 */
declare interface EncounterConditionValue {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 关联的遭遇条件 */
  encounterCondition?: EncounterCondition | null
}

/**
 * 遭遇条件值(EncounterConditionValue)查询条件
 */
declare interface EncounterConditionValueQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 遭遇条件 ID */
  encounterConditionId?: NullableId
}

/**
 * 遭遇条件值(EncounterConditionValue)表单模型
 */
declare interface EncounterConditionValueFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 遭遇条件 ID */
  encounterConditionId: NullableId
}

/**
 * 遭遇方式(EncounterMethod)实体
 */
declare interface EncounterMethod {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 排序顺序 */
  sortingOrder?: number | null
}

/**
 * 遭遇方式(EncounterMethod)查询条件
 */
declare interface EncounterMethodQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 排序顺序 */
  sortingOrder?: number | null
}

/**
 * 遭遇方式(EncounterMethod)表单模型
 */
declare interface EncounterMethodFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 排序顺序 */
  sortingOrder: number | null
}

/**
 * 进化触发方式(EvolutionTrigger)实体
 */
declare interface EvolutionTrigger {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 进化触发方式(EvolutionTrigger)查询条件
 */
declare interface EvolutionTriggerQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 进化触发方式(EvolutionTrigger)表单模型
 */
declare interface EvolutionTriggerFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}
