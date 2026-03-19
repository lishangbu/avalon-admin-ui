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
  isBattleOnly?: boolean | null
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
  isBattleOnly?: boolean | null
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
  isBattleOnly: number | null
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
 * 属性克制关系复合主键
 */
declare interface TypeDamageRelationId {
  /** 攻击方属性 */
  attackingType?: Type | null
  /** 防御方属性 */
  defendingType?: Type | null
}

/**
 * 属性克制关系(TypeDamageRelation)实体
 */
declare interface TypeDamageRelation {
  /** 复合主键 */
  id?: TypeDamageRelationId | null
  /** 伤害倍率 */
  multiplier?: number | null
}

/**
 * 属性克制关系查询条件
 */
declare interface TypeDamageRelationQuery {
  /** 攻击方属性 ID */
  attackingTypeId?: NullableId
  /** 防御方属性 ID */
  defendingTypeId?: NullableId
  /** 伤害倍率 */
  multiplier?: number | null
}

/**
 * 属性克制关系表单模型
 */
declare interface TypeDamageRelationFormModel {
  /** 攻击方属性 ID */
  attackingTypeId: NullableId
  /** 防御方属性 ID */
  defendingTypeId: NullableId
  /** 伤害倍率 */
  multiplier: number | null
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
