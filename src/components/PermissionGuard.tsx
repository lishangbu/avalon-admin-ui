import type { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'

export function PermissionGuard({
  permission,
  permissions,
  mode = 'all',
  fallback = null,
  children,
}: {
  permission?: string
  permissions?: string[]
  mode?: 'all' | 'any'
  fallback?: ReactNode
  children: ReactNode
}) {
  const { has, hasAll, hasAny } = usePermission()
  const normalizedPermissions = permissions ?? (permission ? [permission] : [])
  const passed =
    normalizedPermissions.length === 0
      ? true
      : mode === 'any'
        ? hasAny(normalizedPermissions)
        : hasAll(normalizedPermissions)

  if (!passed) {
    return <>{fallback}</>
  }

  if (permission && !permissions) {
    return has(permission) ? <>{children}</> : <>{fallback}</>
  }

  return <>{children}</>
}
