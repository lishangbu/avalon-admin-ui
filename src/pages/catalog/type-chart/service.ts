import { request } from '@/shared/api/http'

type BackendTypeDefinition = {
  id: string
  code: string
  name: string
  description?: string | null
  icon?: string | null
  sortingOrder?: number | null
  enabled?: boolean | null
  version?: number | null
}

type BackendTypeSummary = {
  id: string
  code: string
  name: string
}

type BackendTypeChartEntry = {
  attackingType: BackendTypeSummary
  defendingType: BackendTypeSummary
  multiplier: number
}

type BackendTypeChartResponse = {
  types: BackendTypeDefinition[]
  entries: BackendTypeChartEntry[]
}

export type TypeEffectivenessTypeView = {
  id: string
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

export type TypeChartEntryInput = {
  attackingTypeId: string
  defendingTypeId: string
  multiplier: number
}

export type UpsertTypeEffectivenessMatrixCommand = {
  entries: TypeChartEntryInput[]
}

function pairKey(attackingType: string, defendingType: string) {
  return `${attackingType}::${defendingType}`
}

function toTypeView(type: BackendTypeDefinition | BackendTypeSummary) {
  return {
    id: type.id,
    internalName: type.code,
    name: type.name,
  } satisfies TypeEffectivenessTypeView
}

function resolveEffectiveness(
  value: number | null,
): TypeEffectivenessResult['effectiveness'] {
  if (value === null) {
    return 'incomplete'
  }

  if (value === 0) {
    return 'immune'
  }

  if (value < 1) {
    return 'not-very-effective'
  }

  if (value > 1) {
    return 'super-effective'
  }

  return 'normal-effective'
}

export function normalizeTypeEffectivenessChart(
  payload: BackendTypeChartResponse,
): TypeEffectivenessChart {
  const supportedTypes = [...payload.types]
    .sort((left, right) => {
      const sortingOrderDiff =
        (left.sortingOrder ?? 0) - (right.sortingOrder ?? 0)

      if (sortingOrderDiff !== 0) {
        return sortingOrderDiff
      }

      return left.code.localeCompare(right.code)
    })
    .map((item) => toTypeView(item))

  const entryMap = new Map(
    payload.entries.map((entry) => [
      pairKey(entry.attackingType.code, entry.defendingType.code),
      entry.multiplier,
    ]),
  )

  const rows = supportedTypes.map((attackingType) => ({
    attackingType,
    cells: supportedTypes.map((defendingType) => {
      const multiplier =
        entryMap.get(
          pairKey(attackingType.internalName, defendingType.internalName),
        ) ?? null

      return {
        defendingType,
        multiplier,
        status: multiplier === null ? 'missing' : 'configured',
      } satisfies TypeEffectivenessCell
    }),
  }))

  const expectedPairs = supportedTypes.length * supportedTypes.length
  const configuredPairs = payload.entries.length

  return {
    supportedTypes,
    completeness: {
      expectedPairs,
      configuredPairs,
      missingPairs: Math.max(expectedPairs - configuredPairs, 0),
    },
    rows,
  }
}

export function calculateTypeEffectiveness(
  chart: TypeEffectivenessChart,
  attacking: string | undefined,
  defending: string[],
): TypeEffectivenessResult | null {
  const attackingType = chart.supportedTypes.find(
    (item) => item.internalName === attacking,
  )

  if (!attackingType || defending.length === 0) {
    return null
  }

  const row = chart.rows.find(
    (item) => item.attackingType.internalName === attacking,
  )

  const defendingTypes = defending.map((defendingTypeCode) => {
    const defendingType = chart.supportedTypes.find(
      (item) => item.internalName === defendingTypeCode,
    )

    if (!defendingType) {
      return {
        defendingType: {
          id: '',
          internalName: defendingTypeCode,
          name: defendingTypeCode,
        },
        multiplier: null,
        status: 'missing' as const,
      }
    }

    const cell = row?.cells.find(
      (item) => item.defendingType.internalName === defendingTypeCode,
    )

    return {
      defendingType,
      multiplier: cell?.multiplier ?? null,
      status: cell?.status ?? 'missing',
    }
  })

  const hasMissing = defendingTypes.some((item) => item.multiplier === null)
  const finalMultiplier = hasMissing
    ? null
    : defendingTypes.reduce<number>(
        (current, item) => current * (item.multiplier ?? 1),
        1,
      )

  return {
    attackingType,
    defendingTypes,
    finalMultiplier,
    status: hasMissing ? 'incomplete' : 'complete',
    effectiveness: resolveEffectiveness(finalMultiplier),
  }
}

export function buildTypeEffectivenessMatrixPayload(
  chart: TypeEffectivenessChart,
  matrix: Record<string, number | null>,
): UpsertTypeEffectivenessMatrixCommand {
  return {
    entries: chart.supportedTypes.flatMap((attackingType) =>
      chart.supportedTypes.flatMap((defendingType) => {
        const multiplier =
          matrix[
            pairKey(attackingType.internalName, defendingType.internalName)
          ]

        if (multiplier === null || multiplier === undefined) {
          return []
        }

        return [
          {
            attackingTypeId: attackingType.id,
            defendingTypeId: defendingType.id,
            multiplier,
          },
        ]
      }),
    ),
  }
}

export async function getTypeEffectivenessChart() {
  const response = await request<BackendTypeChartResponse>({
    url: '/catalog/type-chart',
    method: 'GET',
  })

  return normalizeTypeEffectivenessChart(response)
}

export async function upsertTypeEffectivenessMatrix(
  payload: UpsertTypeEffectivenessMatrixCommand,
) {
  const response = await request<BackendTypeChartResponse>({
    url: '/catalog/type-chart',
    method: 'PUT',
    data: payload,
  })

  return normalizeTypeEffectivenessChart(response)
}
