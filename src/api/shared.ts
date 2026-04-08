import { pickBy } from 'es-toolkit'

type AnyObject = object

export function compactParams<T extends AnyObject>(params: T): Partial<T> {
  return pickBy(params, (value) => value !== undefined && value !== null && value !== '')
}

export function withScopedQuery<T extends AnyObject>(
  scope: string,
  query: T,
): Partial<T> & Record<string, unknown> {
  const compactedQuery = compactParams(query)
  const queryEntries = Object.entries(compactedQuery as Record<string, unknown>)

  return {
    ...compactedQuery,
    ...Object.fromEntries(queryEntries.map(([key, value]) => [`${scope}.${key}`, value])),
  }
}

export function normalizePageRequest<T extends AnyObject>(pageRequest: PageRequest<T>) {
  return compactParams({
    page: Math.max((pageRequest.page ?? 1) - 1, 0),
    size: pageRequest.size ?? 10,
    sort: pageRequest.sort ?? 'id,asc',
    ...((pageRequest.query ?? {}) as Record<string, unknown>),
  })
}

export function buildScopedListParams<T extends AnyObject>(scope: string, query: T) {
  return withScopedQuery(scope, query)
}

export function buildScopedPageParams<T extends AnyObject>(
  scope: string,
  pageRequest: PageRequest<T>,
) {
  return normalizePageRequest({
    ...pageRequest,
    query: withScopedQuery(scope, pageRequest.query),
  })
}
