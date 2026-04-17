import { request } from '@/shared/api/http'

export type TypeEffectivenessTypeView = {
  internalName: string
  name: string
}

export type TypeEffectivenessMatchup = {
  defendingType: TypeEffectivenessTypeView
  multiplier?: number | null
  status?: 'configured' | 'missing'
}

export type TypeEffectivenessResult = {
  attackingType: TypeEffectivenessTypeView
  defendingTypes: TypeEffectivenessMatchup[]
  finalMultiplier?: number | null
  status?: 'complete' | 'incomplete'
  effectiveness?:
    | 'immune'
    | 'not-very-effective'
    | 'normal-effective'
    | 'super-effective'
    | 'incomplete'
}

export type TypeEffectivenessCompleteness = {
  expectedPairs: number
  configuredPairs: number
  missingPairs: number
}

export type TypeEffectivenessCell = {
  defendingType: TypeEffectivenessTypeView
  multiplier?: number | null
  status?: 'configured' | 'missing'
}

export type TypeEffectivenessRow = {
  attackingType: TypeEffectivenessTypeView
  cells: TypeEffectivenessCell[]
}

export type TypeEffectivenessChart = {
  supportedTypes: TypeEffectivenessTypeView[]
  completeness: TypeEffectivenessCompleteness
  rows: TypeEffectivenessRow[]
}

export type TypeEffectivenessMatrixCellInput = {
  attackingType: string
  defendingType: string
  multiplier?: number | null
}

export type UpsertTypeEffectivenessMatrixCommand = {
  cells: TypeEffectivenessMatrixCellInput[]
}

export async function calculateTypeEffectiveness(
  attacking: string,
  defending: string[],
) {
  return request<TypeEffectivenessResult>({
    url: '/type-effectiveness',
    method: 'GET',
    params: {
      attacking,
      defending,
    },
    paramsSerializer: {
      indexes: null,
    },
  })
}

export async function getTypeEffectivenessChart() {
  return request<TypeEffectivenessChart>({
    url: '/type-effectiveness/chart',
    method: 'GET',
  })
}

export async function upsertTypeEffectivenessMatrix(
  payload: UpsertTypeEffectivenessMatrixCommand,
) {
  return request<TypeEffectivenessChart>({
    url: '/type-effectiveness/matrix',
    method: 'PUT',
    data: payload,
  })
}
