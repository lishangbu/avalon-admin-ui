import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { compactParams, mapPage } from '@/utils/request'
import {
  type IamUserResponse,
  normalizeUser,
  toBackendUserPayload,
} from '@/pages/iam/shared/idm-normalizers'
import type { SaveUserInput, UpdateUserInput, UserQuery } from './types'

const endpoint = '/iam/users'

export async function getUserById(id: string) {
  const result = await request<IamUserResponse>({
    url: `${endpoint}/${id}`,
    method: 'GET',
  })

  return normalizeUser(result)
}

export async function getUserPage(pageRequest: PageRequest<UserQuery>) {
  const result = await request<Page<IamUserResponse>>({
    url: endpoint,
    method: 'GET',
    params: compactParams({
      page: Math.max(pageRequest.page ?? 1, 1),
      size: pageRequest.size ?? 10,
      ...pageRequest.query,
    }),
  })

  return mapPage(result, normalizeUser)
}

export async function createUser(payload: SaveUserInput) {
  const result = await request<IamUserResponse>({
    url: endpoint,
    method: 'POST',
    data: toBackendUserPayload(payload),
  })

  return normalizeUser(result)
}

export async function updateUser(payload: UpdateUserInput) {
  const result = await request<IamUserResponse>({
    url: `${endpoint}/${payload.id}`,
    method: 'PUT',
    data: toBackendUserPayload(payload),
  })

  return normalizeUser(result)
}

export async function deleteUser(id: string) {
  return request<void>({
    url: `${endpoint}/${id}`,
    method: 'DELETE',
  })
}
