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

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Partial<Page<T>> & {
    rows?: unknown
  }
  const rows = Array.isArray(rawPage.rows) ? (rawPage.rows as T[]) : []

  return {
    rows: rows.map(normalizeItem),
    totalRowCount: rawPage.totalRowCount ?? 0,
    totalPageCount: rawPage.totalPageCount ?? 0,
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

function normalizeTypeEntity(item: Type): Type {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

function normalizeBerryFirmnessEntity(item: BerryFirmness): BerryFirmness {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

function normalizeBerryEntity(item: Berry): Berry {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    growthTime: toNumber((item as { growthTime?: unknown }).growthTime) ?? item.growthTime,
    maxHarvest: toNumber((item as { maxHarvest?: unknown }).maxHarvest) ?? item.maxHarvest,
    bulk: toNumber((item as { bulk?: unknown }).bulk) ?? item.bulk,
    smoothness: toNumber((item as { smoothness?: unknown }).smoothness) ?? item.smoothness,
    soilDryness: toNumber((item as { soilDryness?: unknown }).soilDryness) ?? item.soilDryness,
    naturalGiftPower:
      toNumber((item as { naturalGiftPower?: unknown }).naturalGiftPower) ?? item.naturalGiftPower,
    berryFirmness: item.berryFirmness
      ? normalizeBerryFirmnessEntity(item.berryFirmness)
      : item.berryFirmness,
    naturalGiftType: item.naturalGiftType
      ? normalizeTypeEntity(item.naturalGiftType)
      : item.naturalGiftType,
  }
}

export async function getBerryPage(pageRequest: PageRequest<BerryQuery>) {
  const res = await request<Page<Berry>>({
    url: '/berry/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('berry', {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        berryFirmnessId: pageRequest.query.berryFirmnessId,
        naturalGiftTypeId: pageRequest.query.naturalGiftTypeId,
      }),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeBerryEntity),
  }
}

export async function createBerry(payload: Berry) {
  const res = await request<Berry>({
    url: '/berry',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryEntity(res.data),
  }
}

export async function updateBerry(payload: Berry) {
  const res = await request<Berry>({
    url: '/berry',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryEntity(res.data),
  }
}

export async function deleteBerry(id: Id) {
  return request<void>({
    url: `/berry/${id}`,
    method: 'DELETE',
  })
}
