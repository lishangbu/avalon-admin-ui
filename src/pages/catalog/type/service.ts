import { request } from '@/shared/api/http'

export interface TypeRecord {
  id?: string
  code?: string | null
  name?: string | null
  description?: string | null
  icon?: string | null
  sortingOrder?: number | null
  enabled?: boolean | null
  version?: number | null
}

export interface TypeQuery {
  code?: string
  name?: string
  enabled?: boolean
}

export interface TypeUpsertInput {
  id?: string
  code?: string
  name?: string
  description?: string | null
  icon?: string | null
  sortingOrder?: number
  enabled?: boolean
}

function normalizeKeyword(value?: string | null) {
  const normalized = value?.trim().toLowerCase()
  return normalized ? normalized : undefined
}

function matchesKeyword(source: string | null | undefined, keyword?: string) {
  if (!keyword) {
    return true
  }

  return source?.toLowerCase().includes(keyword) ?? false
}

export async function listRows(query: TypeQuery = {}) {
  const rows = await request<TypeRecord[]>({
    url: '/catalog/types',
    method: 'GET',
  })

  const codeKeyword = normalizeKeyword(query.code)
  const nameKeyword = normalizeKeyword(query.name)

  return rows.filter((row) => {
    if (query.enabled !== undefined && row.enabled !== query.enabled) {
      return false
    }

    return (
      matchesKeyword(row.code, codeKeyword) &&
      matchesKeyword(row.name, nameKeyword)
    )
  })
}

export async function createRow(payload: TypeUpsertInput) {
  return request<TypeRecord>({
    url: '/catalog/types',
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: TypeUpsertInput) {
  const id = payload.id?.trim()

  if (!id) {
    throw new Error('type id is required')
  }

  const data = {
    code: payload.code,
    name: payload.name,
    description: payload.description,
    icon: payload.icon,
    sortingOrder: payload.sortingOrder,
    enabled: payload.enabled,
  }

  return request<TypeRecord>({
    url: `/catalog/types/${id}`,
    method: 'PUT',
    data,
  })
}

export async function deleteRow(id: string) {
  return request<void>({
    url: `/catalog/types/${id}`,
    method: 'DELETE',
  })
}
