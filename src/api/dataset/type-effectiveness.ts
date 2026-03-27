import { isNumber, isString } from 'es-toolkit'

import request from '@/utils/request'

function toNumber(value: unknown) {
  if (isNumber(value) && Number.isFinite(value)) {
    return value
  }

  if (isString(value) && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

function normalizeTypeEffectivenessType(
  item: TypeEffectivenessTypeView,
): TypeEffectivenessTypeView {
  return {
    internalName: item.internalName,
    name: item.name,
  }
}

function normalizeMultiplier(value: unknown) {
  if (value === null || value === undefined) {
    return null
  }

  return toNumber(value) ?? null
}

function normalizeMatchup(item: TypeEffectivenessMatchup): TypeEffectivenessMatchup {
  return {
    ...item,
    defendingType: normalizeTypeEffectivenessType(item.defendingType),
    multiplier: normalizeMultiplier((item as { multiplier?: unknown }).multiplier),
  }
}

function normalizeCell(item: TypeEffectivenessCell): TypeEffectivenessCell {
  return {
    ...item,
    defendingType: normalizeTypeEffectivenessType(item.defendingType),
    multiplier: normalizeMultiplier((item as { multiplier?: unknown }).multiplier),
  }
}

function normalizeChart(chart: TypeEffectivenessChart): TypeEffectivenessChart {
  return {
    supportedTypes: chart.supportedTypes.map(normalizeTypeEffectivenessType),
    completeness: {
      expectedPairs: toNumber(chart.completeness.expectedPairs) ?? 0,
      configuredPairs: toNumber(chart.completeness.configuredPairs) ?? 0,
      missingPairs: toNumber(chart.completeness.missingPairs) ?? 0,
    },
    rows: chart.rows.map((row) => ({
      attackingType: normalizeTypeEffectivenessType(row.attackingType),
      cells: row.cells.map(normalizeCell),
    })),
  }
}

function normalizeResult(result: TypeEffectivenessResult): TypeEffectivenessResult {
  return {
    ...result,
    attackingType: normalizeTypeEffectivenessType(result.attackingType),
    defendingTypes: result.defendingTypes.map(normalizeMatchup),
    finalMultiplier: normalizeMultiplier((result as { finalMultiplier?: unknown }).finalMultiplier),
  }
}

export async function calculateTypeEffectiveness(attacking: string, defending: string[]) {
  const res = await request<TypeEffectivenessResult>({
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

  return {
    ...res,
    data: normalizeResult(res.data),
  }
}

export async function getTypeEffectivenessChart() {
  const res = await request<TypeEffectivenessChart>({
    url: '/type-effectiveness/chart',
    method: 'GET',
  })

  return {
    ...res,
    data: normalizeChart(res.data),
  }
}

export async function upsertTypeEffectivenessMatrix(payload: UpsertTypeEffectivenessMatrixCommand) {
  const res = await request<TypeEffectivenessChart>({
    url: '/type-effectiveness/matrix',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeChart(res.data),
  }
}
