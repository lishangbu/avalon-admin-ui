/**
 * 树果(Berry)类型定义
 */
export interface Berry {
  /** 主键 */
  id: number;
  /** 内部名称 */
  internalName: string;
  /** 名称 */
  name: string;
  /** 生长到下一个阶段所需的时间(小时) */
  growthTime: number;
  /** 最大结果数 */
  maxHarvest: number;
  /** 大小（毫米） */
  bulk: number;
  /** 光滑度 */
  smoothness: number;
  /** 生长时使土壤干燥的速度，数值越高土壤干燥越快 */
  soilDryness: number;
  /** 树果的坚硬度(内部名称) */
  firmnessInternalName: string;
  /** 搭配该树果使用“自然之恩”招式时继承的属性类型 */
  naturalGiftTypeInternalName: string;
  /** 搭配该树果使用“自然之恩”招式时的威力 */
  naturalGiftPower: number;
}

export interface BerryQuery extends PageRequest{
  internalName?: string;
  name?: string;
  firmnessInternalName?: string;
  naturalGiftTypeInternalName?: string;
}
