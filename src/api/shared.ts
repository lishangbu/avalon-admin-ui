import { isNumber, isString, pickBy } from 'es-toolkit'
import type { AxiosRequestConfig } from 'axios'
import { z } from 'zod'

import { request } from '@/utils/request'

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

function normalizeNumberish(value: unknown) {
  if (isNumber(value) && Number.isFinite(value)) {
    return value
  }

  if (isString(value) && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return value
}

function normalizeBooleanish(value: unknown) {
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

  return value
}

const idValueSchema = z.union([z.string(), z.number()])
const numberValueSchema = z.preprocess(normalizeNumberish, z.number())
const booleanValueSchema = z.preprocess(normalizeBooleanish, z.boolean())

export const idFieldSchema = idValueSchema.optional()
export const nullableIdFieldSchema = idValueSchema.nullable().optional()
export const numberFieldSchema = numberValueSchema.optional()
export const nullableNumberFieldSchema = z.preprocess(
  (value) => (value === null ? null : normalizeNumberish(value)),
  z.number().nullable().optional(),
)
export const booleanFieldSchema = booleanValueSchema.optional()
export const nullableBooleanFieldSchema = z.preprocess(
  (value) => (value === null ? null : normalizeBooleanish(value)),
  z.boolean().nullable().optional(),
)

export function createApiObjectSchema<T extends object>(shape: z.ZodRawShape = {}) {
  return z.looseObject(shape).transform((value) => value as T)
}

export function parseApiEntity<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data)
}

export function parseApiList<T>(schema: z.ZodType<T>, data: unknown): T[] {
  return z.array(schema).parse(data)
}

export function parseApiPage<T>(schema: z.ZodType<T>, data: unknown): Page<T> {
  return z
    .object({
      rows: z.array(schema).catch([]),
      totalRowCount: numberValueSchema.catch(0),
      totalPageCount: numberValueSchema.catch(0),
    })
    .transform(({ rows, totalRowCount, totalPageCount }) => ({
      rows,
      totalRowCount,
      totalPageCount,
    }))
    .parse(data)
}

export function buildScopedListParams<T extends AnyObject>(scope: string, query: T) {
  return withScopedQuery(scope, compactParams(query))
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

export async function requestParsedEntity<T>(
  schema: z.ZodType<T>,
  config: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  const res = await request<unknown>(config)

  return {
    ...res,
    data: parseApiEntity(schema, res.data),
  }
}

export async function requestParsedList<T>(
  schema: z.ZodType<T>,
  config: AxiosRequestConfig,
): Promise<ApiResult<T[]>> {
  const res = await request<unknown>(config)

  return {
    ...res,
    data: parseApiList(schema, res.data),
  }
}

export async function requestParsedPage<T>(
  schema: z.ZodType<T>,
  config: AxiosRequestConfig,
): Promise<ApiResult<Page<T>>> {
  const res = await request<unknown>(config)

  return {
    ...res,
    data: parseApiPage(schema, res.data),
  }
}
