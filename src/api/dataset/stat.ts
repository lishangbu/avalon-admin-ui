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

function normalizePageRequest<T>(pageRequest: PageRequest<T>) {
  return compactParams({
    page: Math.max((pageRequest.page ?? 1) - 1, 0),
    size: pageRequest.size ?? 10,
    sort: pageRequest.sort ?? 'id,asc',
    ...pageRequest.query,
  })
}

function toStringValue(value: unknown) {
  if (isString(value)) {
    return value
  }

  if (isNumber(value) && Number.isFinite(value)) {
    return String(value)
  }

  return undefined
}

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Page<T> & { totalElements?: unknown }

  return {
    content: page.content.map(normalizeItem),
    totalElements: toStringValue(rawPage.totalElements) ?? '0',
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

function normalizeMoveDamageClassEntity(item?: MoveDamageClass | null): MoveDamageClass | null | undefined {
  if (!item) {
    return item
  }

  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

function normalizeStatEntity(item: Stat): Stat {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    gameIndex: toNumber((item as { gameIndex?: unknown }).gameIndex) ?? item.gameIndex,
    isBattleOnly: toBoolean((item as { isBattleOnly?: unknown }).isBattleOnly) ?? item.isBattleOnly,
    moveDamageClass: normalizeMoveDamageClassEntity(item.moveDamageClass),
  }
}

export async function getStatPage(pageRequest: PageRequest<StatQuery>) {
  const res = await request<Page<Stat>>({
    url: '/stat/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('stat', {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        gameIndex: pageRequest.query.gameIndex,
        isBattleOnly: pageRequest.query.isBattleOnly,
        'moveDamageClass.id': pageRequest.query.moveDamageClassId,
      }),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeStatEntity),
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
      isBattleOnly: query.isBattleOnly,
      'moveDamageClass.id': query.moveDamageClassId,
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
