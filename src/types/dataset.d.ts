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
  /** 是否仅战斗属性 */
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
  /** 是否仅战斗属性 */
}

/**
 * 属性(Type)表单模型
 */
declare interface TypeFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 是否仅战斗属性：`1` 表示是，`0` 表示否 */
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
 * 招式异常(MoveAilment)实体
 */
declare interface MoveAilment {
  id?: Id
  internalName?: string
  name?: string
}

/**
 * 招式异常(MoveAilment)查询条件
 */
declare interface MoveAilmentQuery {
  id?: NullableId
  internalName?: string
  name?: string
}

/**
 * 招式异常(MoveAilment)表单模型
 */
declare interface MoveAilmentFormModel {
  id?: NullableId
  internalName: string
  name: string
}

/**
 * 招式类别(MoveCategory)实体
 */
declare interface MoveCategory {
  id?: Id
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式类别(MoveCategory)查询条件
 */
declare interface MoveCategoryQuery {
  id?: NullableId
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式类别(MoveCategory)表单模型
 */
declare interface MoveCategoryFormModel {
  id?: NullableId
  internalName: string
  name: string
  description: string
}

/**
 * 招式学习方式(MoveLearnMethod)实体
 */
declare interface MoveLearnMethod {
  id?: Id
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式学习方式(MoveLearnMethod)查询条件
 */
declare interface MoveLearnMethodQuery {
  id?: NullableId
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式学习方式(MoveLearnMethod)表单模型
 */
declare interface MoveLearnMethodFormModel {
  id?: NullableId
  internalName: string
  name: string
  description: string
}

/**
 * 招式目标(MoveTarget)实体
 */
declare interface MoveTarget {
  id?: Id
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式目标(MoveTarget)查询条件
 */
declare interface MoveTargetQuery {
  id?: NullableId
  internalName?: string
  name?: string
  description?: string
}

/**
 * 招式目标(MoveTarget)表单模型
 */
declare interface MoveTargetFormModel {
  id?: NullableId
  internalName: string
  name: string
  description: string
}

/**
 * 招式(Move)实体
 */
declare interface Move {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 属性 */
  type?: Type | null
  /** 命中率 */
  accuracy?: number | null
  /** 效果触发概率 */
  effectChance?: number | null
  /** PP */
  pp?: number | null
  /** 优先级 */
  priority?: number | null
  /** 威力 */
  power?: number | null
  /** 招式伤害分类 */
  moveDamageClass?: MoveDamageClass | null
  /** 招式目标 */
  moveTarget?: MoveTarget | null
  /** 文本 */
  text?: string
  /** 简称效果 */
  shortEffect?: string
  /** 效果 */
  effect?: string
  /** 招式分类 */
  moveCategory?: MoveCategory | null
  /** 招式异常状态 */
  moveAilment?: MoveAilment | null
  /** 最小命中次数 */
  minHits?: number | null
  /** 最大命中次数 */
  maxHits?: number | null
  /** 最少回合数 */
  minTurns?: number | null
  /** 最多回合数 */
  maxTurns?: number | null
  /** 吸收 */
  drain?: number | null
  /** 治疗 */
  healing?: number | null
  /** 暴击速率 */
  critRate?: number | null
  /** 异常状态概率 */
  ailmentChance?: number | null
  /** 畏缩概率 */
  flinchChance?: number | null
  /** 能力值概率 */
  statChance?: number | null
}

/**
 * 招式(Move)查询条件
 */
declare interface MoveQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 属性 ID */
  typeId?: NullableId
  /** 招式伤害分类 ID */
  moveDamageClassId?: NullableId
  /** 招式目标 ID */
  moveTargetId?: NullableId
  /** 招式分类 ID */
  moveCategoryId?: NullableId
  /** 招式异常状态 ID */
  moveAilmentId?: NullableId
}

/**
 * 招式(Move)表单模型
 */
declare interface MoveFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 属性 ID */
  typeId: NullableId
  /** 命中率 */
  accuracy: number | null
  /** 效果触发概率 */
  effectChance: number | null
  /** PP */
  pp: number | null
  /** 优先级 */
  priority: number | null
  /** 威力 */
  power: number | null
  /** 招式伤害分类 ID */
  moveDamageClassId: NullableId
  /** 招式目标 ID */
  moveTargetId: NullableId
  /** 文本 */
  text: string
  /** 简称效果 */
  shortEffect: string
  /** 效果 */
  effect: string
  /** 招式分类 ID */
  moveCategoryId: NullableId
  /** 招式异常状态 ID */
  moveAilmentId: NullableId
  /** 最小命中次数 */
  minHits: number | null
  /** 最大命中次数 */
  maxHits: number | null
  /** 最少回合数 */
  minTurns: number | null
  /** 最多回合数 */
  maxTurns: number | null
  /** 吸收 */
  drain: number | null
  /** 治疗 */
  healing: number | null
  /** 暴击速率 */
  critRate: number | null
  /** 异常状态概率 */
  ailmentChance: number | null
  /** 畏缩概率 */
  flinchChance: number | null
  /** 能力值概率 */
  statChance: number | null
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
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 是否仅战斗属性 */
  battleOnly?: boolean | null
  /** 是否只读 */
  readonly?: boolean
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
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 是否仅战斗属性 */
  battleOnly?: boolean | null
  /** 是否只读 */
  readonly?: boolean | null
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
  /** 排序顺序 */
  sortingOrder: number | null
  /** 是否仅战斗属性：`1` 表示是，`0` 表示否 */
  battleOnly: NullableYesNo
  /** 是否只读：`1` 表示是，`0` 表示否 */
  readonly: NullableYesNo
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

/**
 * 进化链(EvolutionChain)实体
 */
declare interface EvolutionChain {
  /** 主键 */
  id?: Id
  /** 幼年触发道具 */
  babyTriggerItem?: Item | null
}

/**
 * 进化链(EvolutionChain)查询条件
 */
declare interface EvolutionChainQuery {
  /** 主键 */
  id?: NullableId
  /** 幼年触发道具 ID */
  babyTriggerItemId?: NullableId
}

/**
 * 进化链(EvolutionChain)表单模型
 */
declare interface EvolutionChainFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 幼年触发道具 ID */
  babyTriggerItemId: NullableId
}

/**
 * 地区(Region)实体
 */
declare interface Region {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 地区(Region)查询条件
 */
declare interface RegionQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 地区(Region)表单模型
 */
declare interface RegionFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 地点(Location)实体
 */
declare interface Location {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 所属地区 */
  region?: Region | null
}

/**
 * 地点(Location)查询条件
 */
declare interface LocationQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 地区 ID */
  regionId?: NullableId
}

/**
 * 地点(Location)表单模型
 */
declare interface LocationFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 地区 ID */
  regionId: NullableId
}

/**
 * 地点区域(LocationArea)实体
 */
declare interface LocationArea {
  /** 主键 */
  id?: Id
  /** 游戏索引 */
  gameIndex?: number | null
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 所属地点 */
  location?: Location | null
}

/**
 * 地点区域(LocationArea)查询条件
 */
declare interface LocationAreaQuery {
  /** 主键 */
  id?: NullableId
  /** 游戏索引 */
  gameIndex?: number | null
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 地点 ID */
  locationId?: NullableId
}

/**
 * 地点区域(LocationArea)表单模型
 */
declare interface LocationAreaFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 游戏索引 */
  gameIndex: number | null
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 地点 ID */
  locationId: NullableId
}

/**
 * 生物颜色(CreatureColor)实体
 */
declare interface CreatureColor {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 生物颜色(CreatureColor)查询条件
 */
declare interface CreatureColorQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 生物颜色(CreatureColor)表单模型
 */
declare interface CreatureColorFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 生物栖息地(CreatureHabitat)实体
 */
declare interface CreatureHabitat {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 生物栖息地(CreatureHabitat)查询条件
 */
declare interface CreatureHabitatQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 生物栖息地(CreatureHabitat)表单模型
 */
declare interface CreatureHabitatFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 生物形状(CreatureShape)实体
 */
declare interface CreatureShape {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 生物形状(CreatureShape)查询条件
 */
declare interface CreatureShapeQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 生物形状(CreatureShape)表单模型
 */
declare interface CreatureShapeFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 生物种族(CreatureSpecies)实体
 */
declare interface CreatureSpecies {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 性别比率 */
  genderRate?: number | null
  /** 捕获率 */
  captureRate?: number | null
  /** 基础亲密度 */
  baseHappiness?: number | null
  /** 是否幼年种 */
  baby?: boolean | null
  /** 是否传说 */
  legendary?: boolean | null
  /** 是否幻之生物 */
  mythical?: boolean | null
  /** 孵化计数器 */
  hatchCounter?: number | null
  /** 是否存在性别差异 */
  hasGenderDifferences?: boolean | null
  /** 形态是否可切换 */
  formsSwitchable?: boolean | null
  /** 前置进化种族 ID */
  evolvesFromSpeciesId?: NullableId
  /** 进化链 ID */
  evolutionChainId?: NullableId
  /** 成长速度 */
  growthRate?: GrowthRate | null
  /** 生物颜色 */
  creatureColor?: CreatureColor | null
  /** 生物栖息地 */
  creatureHabitat?: CreatureHabitat | null
  /** 生物形状 */
  creatureShape?: CreatureShape | null
}

/**
 * 生物种族(CreatureSpecies)查询条件
 */
declare interface CreatureSpeciesQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 性别比率 */
  genderRate?: number | null
  /** 捕获率 */
  captureRate?: number | null
  /** 基础亲密度 */
  baseHappiness?: number | null
  /** 是否幼年种 */
  baby?: boolean | null
  /** 是否传说 */
  legendary?: boolean | null
  /** 是否幻之生物 */
  mythical?: boolean | null
  /** 孵化计数器 */
  hatchCounter?: number | null
  /** 是否存在性别差异 */
  hasGenderDifferences?: boolean | null
  /** 形态是否可切换 */
  formsSwitchable?: boolean | null
  /** 前置进化种族 ID */
  evolvesFromSpeciesId?: NullableId
  /** 进化链 ID */
  evolutionChainId?: NullableId
  /** 成长速度 ID */
  growthRateId?: NullableId
  /** 生物颜色 ID */
  creatureColorId?: NullableId
  /** 生物栖息地 ID */
  creatureHabitatId?: NullableId
  /** 生物形状 ID */
  creatureShapeId?: NullableId
}

/**
 * 生物种族(CreatureSpecies)表单模型
 */
declare interface CreatureSpeciesFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 排序顺序 */
  sortingOrder: number | null
  /** 性别比率 */
  genderRate: number | null
  /** 捕获率 */
  captureRate: number | null
  /** 基础亲密度 */
  baseHappiness: number | null
  /** 是否幼年种：`1` 表示是，`0` 表示否 */
  baby: NullableYesNo
  /** 是否传说：`1` 表示是，`0` 表示否 */
  legendary: NullableYesNo
  /** 是否幻之生物：`1` 表示是，`0` 表示否 */
  mythical: NullableYesNo
  /** 孵化计数器 */
  hatchCounter: number | null
  /** 是否存在性别差异：`1` 表示是，`0` 表示否 */
  hasGenderDifferences: NullableYesNo
  /** 形态是否可切换：`1` 表示是，`0` 表示否 */
  formsSwitchable: NullableYesNo
  /** 前置进化种族 ID */
  evolvesFromSpeciesId: NullableId
  /** 进化链 ID */
  evolutionChainId: NullableId
  /** 成长速度 ID */
  growthRateId: NullableId
  /** 生物颜色 ID */
  creatureColorId: NullableId
  /** 生物栖息地 ID */
  creatureHabitatId: NullableId
  /** 生物形状 ID */
  creatureShapeId: NullableId
}

/**
 * 生物(Creature)实体
 */
declare interface Creature {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 身高 */
  height?: number | null
  /** 体重 */
  weight?: number | null
  /** 基础经验 */
  baseExperience?: number | null
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 生物种族 */
  creatureSpecies?: CreatureSpecies | null
}

/**
 * 生物(Creature)查询条件
 */
declare interface CreatureQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 身高 */
  height?: number | null
  /** 体重 */
  weight?: number | null
  /** 基础经验 */
  baseExperience?: number | null
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 生物种族 ID */
  creatureSpeciesId?: NullableId
}

/**
 * 生物(Creature)表单模型
 */
declare interface CreatureCrudFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 身高 */
  height: number | null
  /** 体重 */
  weight: number | null
  /** 基础经验 */
  baseExperience: number | null
  /** 排序顺序 */
  sortingOrder: number | null
  /** 生物种族 ID */
  creatureSpeciesId: NullableId
}

/**
 * 生物变体(CreatureVariant)实体
 */
declare interface CreatureVariant {
  /** 主键 */
  id?: Id
  /** 背面默认图片 */
  backDefault?: string | null
  /** 背面雌性图片 */
  backFemale?: string | null
  /** 背面闪光图片 */
  backShiny?: string | null
  /** 背面闪光雌性图片 */
  backShinyFemale?: string | null
  /** 是否仅战斗形态 */
  battleOnly?: boolean | null
  /** 是否默认形态 */
  defaultForm?: boolean | null
  /** 形态名称 */
  formName?: string | null
  /** 形态顺序 */
  formOrder?: number | null
  /** 正面默认图片 */
  frontDefault?: string | null
  /** 正面雌性图片 */
  frontFemale?: string | null
  /** 正面闪光图片 */
  frontShiny?: string | null
  /** 正面闪光雌性图片 */
  frontShinyFemale?: string | null
  /** 内部名称（英文标识） */
  internalName?: string
  /** 是否超级进化形态 */
  mega?: boolean | null
  /** 显示名称 */
  name?: string
  /** 所属生物 */
  creature?: Creature | null
  /** 排序顺序 */
  sortingOrder?: number | null
}

/**
 * 生物变体(CreatureVariant)查询条件
 */
declare interface CreatureVariantQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 形态名称（支持模糊匹配） */
  formName?: string
  /** 是否仅战斗形态 */
  battleOnly?: boolean | null
  /** 是否默认形态 */
  defaultForm?: boolean | null
  /** 是否超级进化形态 */
  mega?: boolean | null
  /** 形态顺序 */
  formOrder?: number | null
  /** 排序顺序 */
  sortingOrder?: number | null
  /** 生物 ID */
  creatureId?: NullableId
}

/**
 * 生物变体(CreatureVariant)表单模型
 */
declare interface CreatureVariantFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 背面默认图片 */
  backDefault: string
  /** 背面雌性图片 */
  backFemale: string
  /** 背面闪光图片 */
  backShiny: string
  /** 背面闪光雌性图片 */
  backShinyFemale: string
  /** 是否仅战斗形态：`1` 表示是，`0` 表示否 */
  battleOnly: NullableYesNo
  /** 是否默认形态：`1` 表示是，`0` 表示否 */
  defaultForm: NullableYesNo
  /** 形态名称 */
  formName: string
  /** 形态顺序 */
  formOrder: number | null
  /** 正面默认图片 */
  frontDefault: string
  /** 正面雌性图片 */
  frontFemale: string
  /** 正面闪光图片 */
  frontShiny: string
  /** 正面闪光雌性图片 */
  frontShinyFemale: string
  /** 内部名称（英文标识） */
  internalName: string
  /** 是否超级进化形态：`1` 表示是，`0` 表示否 */
  mega: NullableYesNo
  /** 显示名称 */
  name: string
  /** 生物 ID */
  creatureId: NullableId
  /** 排序顺序 */
  sortingOrder: number | null
}

/**
 * 生物进化条件(CreatureEvolution)实体
 */
declare interface CreatureEvolution {
  /** 主键 */
  id?: Id
  /** 分支顺序 */
  branchSortOrder?: number | null
  /** 条件顺序 */
  detailSortOrder?: number | null
  /** 是否需要多人联机 */
  needsMultiplayer?: boolean | null
  /** 是否需要大地图下雨 */
  needsOverworldRain?: boolean | null
  /** 是否需要设备倒置 */
  turnUpsideDown?: boolean | null
  /** 时间段 */
  timeOfDay?: string | null
  /** 最低亲密互动值 */
  minAffection?: number | null
  /** 最低美丽值 */
  minBeauty?: number | null
  /** 最低承伤值 */
  minDamageTaken?: number | null
  /** 最低亲密度 */
  minHappiness?: number | null
  /** 最低等级 */
  minLevel?: number | null
  /** 最低招式使用次数 */
  minMoveCount?: number | null
  /** 最低步数 */
  minSteps?: number | null
  /** 相对物攻物防关系 */
  relativePhysicalStats?: number | null
  /** 进化链 */
  evolutionChain?: EvolutionChain | null
  /** 起始种族 */
  fromCreatureSpecies?: CreatureSpecies | null
  /** 目标种族 */
  toCreatureSpecies?: CreatureSpecies | null
  /** 性别 */
  gender?: Gender | null
  /** 携带道具 */
  heldItem?: Item | null
  /** 使用道具 */
  item?: Item | null
  /** 已学会招式 */
  knownMove?: Move | null
  /** 已学会招式属性 */
  knownMoveType?: Type | null
  /** 地点 */
  location?: Location | null
  /** 同队种族 */
  partyCreatureSpecies?: CreatureSpecies | null
  /** 同队属性 */
  partyType?: Type | null
  /** 交换种族 */
  tradeCreatureSpecies?: CreatureSpecies | null
  /** 进化触发方式 */
  trigger?: EvolutionTrigger | null
  /** 使用招式 */
  usedMove?: Move | null
  /** 地区 */
  region?: Region | null
  /** 基础变体 */
  baseVariant?: CreatureVariant | null
}

/**
 * 生物进化条件(CreatureEvolution)查询条件
 */
declare interface CreatureEvolutionQuery {
  /** 主键 */
  id?: NullableId
  /** 分支顺序 */
  branchSortOrder?: number | null
  /** 条件顺序 */
  detailSortOrder?: number | null
  /** 时间段 */
  timeOfDay?: string
  /** 最低等级 */
  minLevel?: number | null
  /** 进化链 ID */
  evolutionChainId?: NullableId
  /** 起始种族 ID */
  fromCreatureSpeciesId?: NullableId
  /** 目标种族 ID */
  toCreatureSpeciesId?: NullableId
  /** 进化触发方式 ID */
  triggerId?: NullableId
  /** 使用道具 ID */
  itemId?: NullableId
  /** 携带道具 ID */
  heldItemId?: NullableId
  /** 地点 ID */
  locationId?: NullableId
  /** 性别 ID */
  genderId?: NullableId
  /** 基础变体 ID */
  baseVariantId?: NullableId
  /** 地区 ID */
  regionId?: NullableId
}

/**
 * 生物进化条件(CreatureEvolution)表单模型
 */
declare interface CreatureEvolutionFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 分支顺序 */
  branchSortOrder: number | null
  /** 条件顺序 */
  detailSortOrder: number | null
  /** 是否需要多人联机：`1` 表示是，`0` 表示否 */
  needsMultiplayer: NullableYesNo
  /** 是否需要大地图下雨：`1` 表示是，`0` 表示否 */
  needsOverworldRain: NullableYesNo
  /** 是否需要设备倒置：`1` 表示是，`0` 表示否 */
  turnUpsideDown: NullableYesNo
  /** 时间段 */
  timeOfDay: string
  /** 最低亲密互动值 */
  minAffection: number | null
  /** 最低美丽值 */
  minBeauty: number | null
  /** 最低承伤值 */
  minDamageTaken: number | null
  /** 最低亲密度 */
  minHappiness: number | null
  /** 最低等级 */
  minLevel: number | null
  /** 最低招式使用次数 */
  minMoveCount: number | null
  /** 最低步数 */
  minSteps: number | null
  /** 相对物攻物防关系 */
  relativePhysicalStats: number | null
  /** 性别 ID */
  genderId: NullableId
  /** 基础变体 ID */
  baseVariantId: NullableId
  /** 地区 ID */
  regionId: NullableId
  /** 进化链 ID */
  evolutionChainId: NullableId
  /** 起始种族 ID */
  fromCreatureSpeciesId: NullableId
  /** 目标种族 ID */
  toCreatureSpeciesId: NullableId
  /** 携带道具 ID */
  heldItemId: NullableId
  /** 使用道具 ID */
  itemId: NullableId
  /** 已学会招式 ID */
  knownMoveId: NullableId
  /** 已学会招式属性 ID */
  knownMoveTypeId: NullableId
  /** 地点 ID */
  locationId: NullableId
  /** 同队种族 ID */
  partyCreatureSpeciesId: NullableId
  /** 同队属性 ID */
  partyTypeId: NullableId
  /** 交换种族 ID */
  tradeCreatureSpeciesId: NullableId
  /** 进化触发方式 ID */
  triggerId: NullableId
  /** 使用招式 ID */
  usedMoveId: NullableId
}

/**
 * 道具口袋(ItemPocket)实体
 */
declare interface ItemPocket {
  id?: Id
  internalName?: string
  name?: string
}

/**
 * 道具口袋(ItemPocket)查询条件
 */
declare interface ItemPocketQuery {
  id?: NullableId
  internalName?: string
  name?: string
}

/**
 * 道具口袋(ItemPocket)表单模型
 */
declare interface ItemPocketFormModel {
  id?: NullableId
  internalName: string
  name: string
}

/**
 * 道具类别(ItemCategory)实体
 */
declare interface ItemCategory {
  id?: Id
  internalName?: string
  name?: string
  itemPocket?: ItemPocket | null
}

/**
 * 道具类别(ItemCategory)查询条件
 */
declare interface ItemCategoryQuery {
  id?: NullableId
  internalName?: string
  name?: string
  itemPocketId?: NullableId
}

/**
 * 道具类别(ItemCategory)表单模型
 */
declare interface ItemCategoryFormModel {
  id?: NullableId
  internalName: string
  name: string
  itemPocketId: NullableId
}

/**
 * 道具投掷效果(ItemFlingEffect)实体
 */
declare interface ItemFlingEffect {
  id?: Id
  internalName?: string
  name?: string
  effect?: string
}

/**
 * 道具投掷效果(ItemFlingEffect)查询条件
 */
declare interface ItemFlingEffectQuery {
  id?: NullableId
  internalName?: string
  name?: string
  effect?: string
}

/**
 * 道具投掷效果(ItemFlingEffect)表单模型
 */
declare interface ItemFlingEffectFormModel {
  id?: NullableId
  internalName: string
  name: string
  effect: string
}

/**
 * 道具属性(ItemAttribute)实体
 */
declare interface ItemAttribute {
  id?: Id
  internalName?: string
  name?: string
  description?: string
}

/**
 * 道具属性(ItemAttribute)查询条件
 */
declare interface ItemAttributeQuery {
  id?: NullableId
  internalName?: string
  name?: string
  description?: string
}

/**
 * 道具属性(ItemAttribute)表单模型
 */
declare interface ItemAttributeFormModel {
  id?: NullableId
  internalName: string
  name: string
  description: string
}

/**
 * 道具(Item)实体
 */
declare interface Item {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
  /** 价格 */
  cost?: number | null
  /** 投掷威力 */
  flingPower?: number | null
  /** 道具投掷效果 */
  itemFlingEffect?: ItemFlingEffect | null
  /** 道具属性 */
  itemAttributes?: ItemAttribute[]
  /** 简称效果 */
  shortEffect?: string
  /** 效果说明 */
  effect?: string
  /** 额外文本 */
  text?: string
}

/**
 * 道具(Item)查询条件
 */
declare interface ItemQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
  /** 道具投掷效果 ID */
  itemFlingEffectId?: NullableId
}

/**
 * 道具(Item)表单模型
 */
declare interface ItemFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
  /** 价格 */
  cost: number | null
  /** 投掷威力 */
  flingPower: number | null
  /** 道具投掷效果 ID */
  itemFlingEffectId: NullableId
  /** 道具属性 ID 列表 */
  itemAttributeIds: Id[]
  /** 简称效果 */
  shortEffect: string
  /** 效果说明 */
  effect: string
  /** 额外文本 */
  text: string
}

/**
 * 能力值计算器中的单项精灵预设
 */
declare interface StatCalculatorCreatureStatPreset {
  /** 能力项 ID */
  statId: string
  /** 能力项内部名称 */
  statInternalName: string
  /** 能力项显示名称 */
  statName: string
  /** 基础能力值 */
  baseStat: number
  /** 努力值产出 */
  effortYield: number
}

/**
 * 能力值计算器中的精灵预设
 */
declare interface StatCalculatorCreaturePreset {
  /** 精灵 ID */
  creatureId: string
  /** 精灵内部名称 */
  creatureInternalName: string
  /** 精灵显示名称 */
  creatureName: string
  /** 精灵种族 ID */
  creatureSpeciesId?: string | null
  /** 精灵种族内部名称 */
  creatureSpeciesInternalName?: string | null
  /** 精灵种族显示名称 */
  creatureSpeciesName?: string | null
  /** 六围预设 */
  stats: StatCalculatorCreatureStatPreset[]
}

/**
 * 能力值计算器单项输入
 */
declare interface StatCalculatorEntryRequest {
  /** 能力项 ID */
  statId: number
  /** 基础能力值 */
  baseStat: number
  /** 个体值 */
  iv: number
  /** 努力值 */
  ev: number
}

/**
 * 能力值计算器请求
 */
declare interface StatCalculatorRequest {
  /** 等级 */
  level: number
  /** 性格 ID */
  natureId?: number | null
  /** 能力项列表 */
  stats: StatCalculatorEntryRequest[]
}

/**
 * 能力值计算器性格信息
 */
declare interface StatCalculatorNatureView {
  /** 性格 ID */
  id: string
  /** 性格内部名称 */
  internalName: string
  /** 性格显示名称 */
  name: string
  /** 提升能力项 ID */
  increasedStatId?: string | null
  /** 提升能力项内部名称 */
  increasedStatInternalName?: string | null
  /** 提升能力项显示名称 */
  increasedStatName?: string | null
  /** 降低能力项 ID */
  decreasedStatId?: string | null
  /** 降低能力项内部名称 */
  decreasedStatInternalName?: string | null
  /** 降低能力项显示名称 */
  decreasedStatName?: string | null
}

/**
 * 能力值计算器单项结果
 */
declare interface StatCalculatorEntryResultView {
  /** 能力项 ID */
  statId: string
  /** 能力项内部名称 */
  statInternalName: string
  /** 能力项显示名称 */
  statName: string
  /** 基础能力值 */
  baseStat: number
  /** 个体值 */
  iv: number
  /** 努力值 */
  ev: number
  /** 当前能力值 */
  actualValue: number
  /** 最小能力值 */
  minimumValue: number
  /** 最大能力值 */
  maximumValue: number
  /** 性格修正系数 */
  natureModifier: number
}

/**
 * 能力值计算器结果
 */
declare interface StatCalculatorResultView {
  /** 等级 */
  level: number
  /** 总努力值 */
  totalEv: number
  /** 性格信息 */
  nature?: StatCalculatorNatureView | null
  /** 能力项结果 */
  stats: StatCalculatorEntryResultView[]
}
