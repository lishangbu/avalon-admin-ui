import { pickBy } from 'es-toolkit'

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

function normalizeOauthRegisteredClientEntity(item: OauthRegisteredClient): OauthRegisteredClient {
  return {
    ...item,
    requireProofKey:
      toBoolean((item as { requireProofKey?: unknown }).requireProofKey) ?? item.requireProofKey,
    requireAuthorizationConsent:
      toBoolean((item as { requireAuthorizationConsent?: unknown }).requireAuthorizationConsent) ??
      item.requireAuthorizationConsent,
    reuseRefreshTokens:
      toBoolean((item as { reuseRefreshTokens?: unknown }).reuseRefreshTokens) ??
      item.reuseRefreshTokens,
    x509CertificateBoundAccessTokens:
      toBoolean(
        (item as { x509CertificateBoundAccessTokens?: unknown }).x509CertificateBoundAccessTokens,
      ) ?? item.x509CertificateBoundAccessTokens,
  }
}

export async function getOauthRegisteredClientById(id: string) {
  const res = await request<OauthRegisteredClient>({
    url: `/oauth-registered-client/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: normalizeOauthRegisteredClientEntity(res.data),
  }
}

export async function getOauthRegisteredClientPage(
  pageRequest: PageRequest<OauthRegisteredClientQuery>,
) {
  const res = await request<Page<OauthRegisteredClient>>({
    url: '/oauth-registered-client/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('registeredClient', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeOauthRegisteredClientEntity),
  }
}

export async function listOauthRegisteredClients(query: OauthRegisteredClientQuery = {}) {
  const res = await request<OauthRegisteredClient[]>({
    url: '/oauth-registered-client/list',
    method: 'GET',
    params: withScopedQuery('registeredClient', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeOauthRegisteredClientEntity),
  }
}

export async function createOauthRegisteredClient(payload: OauthRegisteredClient) {
  const res = await request<OauthRegisteredClient>({
    url: '/oauth-registered-client',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeOauthRegisteredClientEntity(res.data),
  }
}

export async function updateOauthRegisteredClient(payload: OauthRegisteredClient) {
  const res = await request<OauthRegisteredClient>({
    url: '/oauth-registered-client',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeOauthRegisteredClientEntity(res.data),
  }
}

export async function deleteOauthRegisteredClient(id: string) {
  return request<void>({
    url: `/oauth-registered-client/${id}`,
    method: 'DELETE',
  })
}
