import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listGenders(query: GenderQuery = {}) {
  return request<Gender[]>({
    url: '/gender/list',
    method: 'GET',
    params: withScopedQuery('gender', query),
  })
}

export async function createGender(payload: GenderFormModel) {
  return request<Gender>({
    url: '/gender',
    method: 'POST',
    data: payload,
  })
}

export async function updateGender(payload: GenderFormModel) {
  return request<Gender>({
    url: '/gender',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteGender(id: Id) {
  return request<void>({
    url: `/gender/${id}`,
    method: 'DELETE',
  })
}
