import { useMemo } from 'react'
import { useAuthStore } from '@/store/auth'

function normalizeCodes(codes?: string[] | null) {
  return (codes ?? [])
    .map((code) => code.trim())
    .filter((code) => code.length > 0)
}

export function usePermission() {
  const permissionCodes = useAuthStore((state) => state.user?.permissionCodes ?? [])

  const codeSet = useMemo(
    () => new Set(normalizeCodes(permissionCodes)),
    [permissionCodes],
  )

  function has(code?: string | null) {
    if (!code) {
      return true
    }
    return codeSet.has(code)
  }

  function hasAll(codes: Array<string | null | undefined>) {
    return codes.every((code) => has(code))
  }

  function hasAny(codes: Array<string | null | undefined>) {
    return codes.some((code) => has(code))
  }

  return {
    permissionCodes: Array.from(codeSet),
    has,
    hasAll,
    hasAny,
  }
}
