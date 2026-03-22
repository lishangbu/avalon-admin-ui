import { isNumber, isString, pickBy } from 'es-toolkit'

import request from '@/utils/request'

function compactParams(params: object) {
  return pickBy(params, (value) => value !== undefined && value !== null && value !== '')
}

function normalizePageRequest<T>(pageRequest: PageRequest<T>) {
  return compactParams({
    page: Math.max((pageRequest.page ?? 1) - 1, 0),
    size: pageRequest.size ?? 10,
    sort: pageRequest.sort ?? 'id,asc',
    ...pageRequest.query,
  })
}

function toNumberValue(value: unknown) {
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

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Partial<Page<T>> & {
    rows?: unknown
    totalRowCount?: unknown
    totalPageCount?: unknown
  }
  const rows = Array.isArray(rawPage.rows) ? (rawPage.rows as T[]) : []

  return {
    rows: rows.map(normalizeItem),
    totalRowCount: toNumberValue(rawPage.totalRowCount) ?? 0,
    totalPageCount: toNumberValue(rawPage.totalPageCount) ?? 0,
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

function normalizeTypeDamageRelationEntity(item: TypeDamageRelation): TypeDamageRelation {
  return {
    ...item,
    id: item.id
      ? {
          attackingType: item.id.attackingType ? normalizeTypeEntity(item.id.attackingType) : item.id.attackingType,
          defendingType: item.id.defendingType ? normalizeTypeEntity(item.id.defendingType) : item.id.defendingType,
        }
      : item.id,
    multiplier:
      typeof item.multiplier === 'number'
        ? item.multiplier
        : toNumber((item as { multiplier?: unknown }).multiplier) ?? item.multiplier,
  }
}

export async function getTypeDamageRelationPage(pageRequest: PageRequest<TypeDamageRelationQuery>) {
  const res = await request<Page<TypeDamageRelation>>({
    url: '/type-damage-relation/page',
    method: 'GET',
    params: normalizePageRequest(pageRequest),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeTypeDamageRelationEntity),
  }
}

export async function listTypeDamageRelations(query: TypeDamageRelationQuery = {}) {
  const res = await request<TypeDamageRelation[]>({
    url: '/type-damage-relation/list',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: res.data.map(normalizeTypeDamageRelationEntity),
  }
}

export async function createTypeDamageRelation(payload: TypeDamageRelation) {
  const res = await request<TypeDamageRelation>({
    url: '/type-damage-relation',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeTypeDamageRelationEntity(res.data),
  }
}

export async function updateTypeDamageRelation(payload: TypeDamageRelation) {
  const res = await request<TypeDamageRelation>({
    url: '/type-damage-relation',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeTypeDamageRelationEntity(res.data),
  }
}

export async function deleteTypeDamageRelation(attackingTypeId: Id, defendingTypeId: Id) {
  return request<void>({
    url: `/type-damage-relation/${attackingTypeId}/${defendingTypeId}`,
    method: 'DELETE',
  })
}
