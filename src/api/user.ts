import { z } from 'zod'

import { createApiObjectSchema, idFieldSchema, requestParsedEntity } from '@/api/shared'

const authRoleSchema = createApiObjectSchema<AuthRole>({
  id: idFieldSchema,
})

const authUserSchema = createApiObjectSchema<AuthUser>({
  id: idFieldSchema,
  roles: z.array(authRoleSchema).catch([]),
})

/**
 * 获取当前用户信息
 *
 * @returns 包含用户信息的 API 结果
 */
export async function getUserInfo() {
  return requestParsedEntity(authUserSchema, {
    url: '/user/info',
    method: 'GET',
  })
}
