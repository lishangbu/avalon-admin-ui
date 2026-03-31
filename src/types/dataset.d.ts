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
  battleOnly?: boolean | null
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
  battleOnly?: boolean | null
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
  battleOnly: NullableYesNo
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
  /** 游戏侧索引 ID */
  gameIndex?: number | null
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
  /** 游戏侧索引 ID */
  gameIndex?: number | null
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
  /** 游戏侧索引 ID */
  gameIndex: number | null
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
 * 宝可梦颜色(PokemonColor)实体
 */
declare interface PokemonColor {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 宝可梦颜色(PokemonColor)查询条件
 */
declare interface PokemonColorQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 宝可梦颜色(PokemonColor)表单模型
 */
declare interface PokemonColorFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 宝可梦栖息地(PokemonHabitat)实体
 */
declare interface PokemonHabitat {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 宝可梦栖息地(PokemonHabitat)查询条件
 */
declare interface PokemonHabitatQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 宝可梦栖息地(PokemonHabitat)表单模型
 */
declare interface PokemonHabitatFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 宝可梦形状(PokemonShape)实体
 */
declare interface PokemonShape {
  /** 主键 */
  id?: Id
  /** 内部名称（英文标识） */
  internalName?: string
  /** 显示名称 */
  name?: string
}

/**
 * 宝可梦形状(PokemonShape)查询条件
 */
declare interface PokemonShapeQuery {
  /** 主键 */
  id?: NullableId
  /** 内部名称（支持模糊匹配） */
  internalName?: string
  /** 显示名称（支持模糊匹配） */
  name?: string
}

/**
 * 宝可梦形状(PokemonShape)表单模型
 */
declare interface PokemonShapeFormModel {
  /** 主键（编辑时存在） */
  id?: NullableId
  /** 内部名称（英文标识） */
  internalName: string
  /** 显示名称 */
  name: string
}

/**
 * 宝可梦种族(PokemonSpecies)实体
 */
declare interface PokemonSpecies {
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
  /** 是否幻之宝可梦 */
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
  /** 宝可梦颜色 */
  pokemonColor?: PokemonColor | null
  /** 宝可梦栖息地 */
  pokemonHabitat?: PokemonHabitat | null
  /** 宝可梦形状 */
  pokemonShape?: PokemonShape | null
}

/**
 * 宝可梦种族(PokemonSpecies)查询条件
 */
declare interface PokemonSpeciesQuery {
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
  /** 是否幻之宝可梦 */
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
  /** 宝可梦颜色 ID */
  pokemonColorId?: NullableId
  /** 宝可梦栖息地 ID */
  pokemonHabitatId?: NullableId
  /** 宝可梦形状 ID */
  pokemonShapeId?: NullableId
}

/**
 * 宝可梦种族(PokemonSpecies)表单模型
 */
declare interface PokemonSpeciesFormModel {
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
  /** 是否幻之宝可梦：`1` 表示是，`0` 表示否 */
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
  /** 宝可梦颜色 ID */
  pokemonColorId: NullableId
  /** 宝可梦栖息地 ID */
  pokemonHabitatId: NullableId
  /** 宝可梦形状 ID */
  pokemonShapeId: NullableId
}

/**
 * 宝可梦(Pokemon)实体
 */
declare interface Pokemon {
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
  /** 宝可梦种族 */
  pokemonSpecies?: PokemonSpecies | null
}

/**
 * 宝可梦(Pokemon)查询条件
 */
declare interface PokemonQuery {
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
  /** 宝可梦种族 ID */
  pokemonSpeciesId?: NullableId
}

/**
 * 宝可梦(Pokemon)表单模型
 */
declare interface PokemonCrudFormModel {
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
  /** 宝可梦种族 ID */
  pokemonSpeciesId: NullableId
}

/**
 * 宝可梦形态(PokemonForm)实体
 */
declare interface PokemonForm {
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
  /** 所属宝可梦 */
  pokemon?: Pokemon | null
  /** 排序顺序 */
  sortingOrder?: number | null
}

/**
 * 宝可梦形态(PokemonForm)查询条件
 */
declare interface PokemonFormQuery {
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
  /** 宝可梦 ID */
  pokemonId?: NullableId
}

/**
 * 宝可梦形态(PokemonForm)表单模型
 */
declare interface PokemonFormModel {
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
  /** 宝可梦 ID */
  pokemonId: NullableId
  /** 排序顺序 */
  sortingOrder: number | null
}

/**
 * 宝可梦进化条件(PokemonEvolution)实体
 */
declare interface PokemonEvolution {
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
  fromPokemonSpecies?: PokemonSpecies | null
  /** 目标种族 */
  toPokemonSpecies?: PokemonSpecies | null
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
  partySpecies?: PokemonSpecies | null
  /** 同队属性 */
  partyType?: Type | null
  /** 交换种族 */
  tradeSpecies?: PokemonSpecies | null
  /** 进化触发方式 */
  trigger?: EvolutionTrigger | null
  /** 使用招式 */
  usedMove?: Move | null
  /** 地区 */
  region?: Region | null
  /** 基础形态 */
  baseForm?: PokemonForm | null
}

/**
 * 宝可梦进化条件(PokemonEvolution)查询条件
 */
declare interface PokemonEvolutionQuery {
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
  fromPokemonSpeciesId?: NullableId
  /** 目标种族 ID */
  toPokemonSpeciesId?: NullableId
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
  /** 基础形态 ID */
  baseFormId?: NullableId
  /** 地区 ID */
  regionId?: NullableId
}

/**
 * 宝可梦进化条件(PokemonEvolution)表单模型
 */
declare interface PokemonEvolutionFormModel {
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
  /** 基础形态 ID */
  baseFormId: NullableId
  /** 地区 ID */
  regionId: NullableId
  /** 进化链 ID */
  evolutionChainId: NullableId
  /** 起始种族 ID */
  fromPokemonSpeciesId: NullableId
  /** 目标种族 ID */
  toPokemonSpeciesId: NullableId
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
  partySpeciesId: NullableId
  /** 同队属性 ID */
  partyTypeId: NullableId
  /** 交换种族 ID */
  tradeSpeciesId: NullableId
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
