import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
import type {
  OauthRegisteredClientQuery,
  OauthRegisteredClientView,
  SaveOauthRegisteredClientInput,
  UpdateOauthRegisteredClientInput,
} from './types'

export async function getOauthRegisteredClientById(id: string) {
  return request<OauthRegisteredClientView>({
    url: `/oauth-registered-client/${id}`,
    method: 'GET',
  })
}

export async function getOauthRegisteredClientPage(
  pageRequest: PageRequest<OauthRegisteredClientQuery>,
) {
  return request<Page<OauthRegisteredClientView>>({
    url: '/oauth-registered-client/page',
    method: 'GET',
    params: buildScopedPageParams('registeredClient', pageRequest),
  })
}

export async function listOauthRegisteredClients(
  query: OauthRegisteredClientQuery = {},
) {
  return request<OauthRegisteredClientView[]>({
    url: '/oauth-registered-client/list',
    method: 'GET',
    params: buildScopedListParams('registeredClient', query),
  })
}

export async function createOauthRegisteredClient(
  payload: SaveOauthRegisteredClientInput,
) {
  return request<OauthRegisteredClientView>({
    url: '/oauth-registered-client',
    method: 'POST',
    data: payload,
  })
}

export async function updateOauthRegisteredClient(
  payload: UpdateOauthRegisteredClientInput,
) {
  return request<OauthRegisteredClientView>({
    url: '/oauth-registered-client',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteOauthRegisteredClient(id: string) {
  return request<void>({
    url: `/oauth-registered-client/${id}`,
    method: 'DELETE',
  })
}
