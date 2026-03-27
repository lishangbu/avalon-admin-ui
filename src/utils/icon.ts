const ICONIFY_NAME_PATTERN = /^[\w-]+:[\w-]+$/i

export const DEFAULT_ROUTE_ICON = 'ph:browser'

export function isDynamicIconName(value: unknown): value is string {
  return typeof value === 'string' && ICONIFY_NAME_PATTERN.test(value.trim())
}

export function resolveDynamicIconName(value: unknown) {
  if (!isDynamicIconName(value)) {
    return undefined
  }

  return value.trim()
}
