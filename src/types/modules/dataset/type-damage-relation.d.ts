export interface TypeDamageRelation {
  attackingTypeId: number
  defendingTypeId: number
  multiplier: number
}

export interface TypeDamageRelationQuery extends PageRequest {
  attackingTypeId?: number
  defendingTypeId?: number
}

