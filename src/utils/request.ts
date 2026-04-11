import type { PageRequest } from '@/types/common'

export function compactParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  ) as Partial<T>
}

export function withScopedQuery<T extends object>(
  scope: string,
  query: T,
): Partial<T> & Record<string, unknown> {
  const compactedQuery = compactParams(query)

  return {
    ...compactedQuery,
    ...Object.fromEntries(
      Object.entries(compactedQuery).map(([key, value]) => [
        `${scope}.${key}`,
        value,
      ]),
    ),
  }
}

export function normalizePageRequest<T extends object>(
  pageRequest: PageRequest<T>,
) {
  return compactParams({
    page: Math.max((pageRequest.page ?? 1) - 1, 0),
    size: pageRequest.size ?? 10,
    sort: pageRequest.sort ?? 'id,asc',
    ...((pageRequest.query ?? {}) as Record<string, unknown>),
  })
}

export function buildScopedPageParams<T extends object>(
  scope: string,
  pageRequest: PageRequest<T>,
) {
  return normalizePageRequest({
    ...pageRequest,
    query: withScopedQuery(scope, pageRequest.query),
  })
}

export function buildScopedListParams<T extends object>(
  scope: string,
  query: T,
) {
  return compactParams(withScopedQuery(scope, query))
}
