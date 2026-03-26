import { isNumber, isString, pickBy } from 'es-toolkit'

import request from '@/utils/request'

function compactParams(params: object) {
  return pickBy(params, (value) => value !== undefined && value !== null && value !== '')
}

function withScopedQuery(scope: string, query: object) {
  const compactedQuery = compactParams(query)

  return {
    ...compactedQuery,
    ...Object.fromEntries(
      Object.entries(compactedQuery).map(([key, value]) => [`${scope}.${key}`, value]),
    ),
  }
}

function toId(value: unknown) {
  if (isString(value)) {
    return value
  }

  if (isNumber(value) && Number.isFinite(value)) {
    return value
  }

  return undefined
}

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

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true
    }

    if (value === 0) {
      return false
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'true' || normalized === '1') {
      return true
    }

    if (normalized === 'false' || normalized === '0') {
      return false
    }
  }

  return undefined
}

function normalizeMoveDamageClassEntity(
  item?: MoveDamageClass | null,
): MoveDamageClass | null | undefined {
  if (!item) {
    return item
  }

  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

function normalizeStatEntity(item: Stat): Stat {
  const rawItem = item as Stat & {
    battleOnly?: unknown
    isBattleOnly?: unknown
  }

  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    gameIndex: toNumber((item as { gameIndex?: unknown }).gameIndex) ?? item.gameIndex,
    battleOnly:
      toBoolean(rawItem.battleOnly) ?? toBoolean(rawItem.isBattleOnly) ?? item.battleOnly,
    moveDamageClass: normalizeMoveDamageClassEntity(item.moveDamageClass),
  }
}

export async function listStats(query: StatQuery = {}) {
  const res = await request<Stat[]>({
    url: '/stat/list',
    method: 'GET',
    params: withScopedQuery('stat', {
      id: query.id,
      internalName: query.internalName,
      name: query.name,
      gameIndex: query.gameIndex,
      battleOnly: query.battleOnly,
      moveDamageClassId: query.moveDamageClassId,
    }),
  })

  return {
    ...res,
    data: res.data.map(normalizeStatEntity),
  }
}

export async function createStat(payload: Stat) {
  const res = await request<Stat>({
    url: '/stat',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeStatEntity(res.data),
  }
}

export async function updateStat(payload: Stat) {
  const res = await request<Stat>({
    url: '/stat',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeStatEntity(res.data),
  }
}

export async function deleteStat(id: Id) {
  return request<void>({
    url: `/stat/${id}`,
    method: 'DELETE',
  })
}
