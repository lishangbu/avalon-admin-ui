import {
  booleanFieldSchema,
  buildScopedListParams,
  buildScopedPageParams,
  createApiObjectSchema,
  requestParsedEntity,
  requestParsedList,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const oauthRegisteredClientEntitySchema = createApiObjectSchema<OauthRegisteredClient>({
  requireProofKey: booleanFieldSchema,
  requireAuthorizationConsent: booleanFieldSchema,
  reuseRefreshTokens: booleanFieldSchema,
  x509CertificateBoundAccessTokens: booleanFieldSchema,
})

export async function getOauthRegisteredClientById(id: string) {
  return requestParsedEntity(oauthRegisteredClientEntitySchema, {
    url: `/oauth-registered-client/${id}`,
    method: 'GET',
  })
}

export async function getOauthRegisteredClientPage(
  pageRequest: PageRequest<OauthRegisteredClientQuery>,
) {
  return requestParsedPage(oauthRegisteredClientEntitySchema, {
    url: '/oauth-registered-client/page',
    method: 'GET',
    params: buildScopedPageParams('registeredClient', pageRequest),
  })
}

export async function listOauthRegisteredClients(query: OauthRegisteredClientQuery = {}) {
  return requestParsedList(oauthRegisteredClientEntitySchema, {
    url: '/oauth-registered-client/list',
    method: 'GET',
    params: buildScopedListParams('registeredClient', query),
  })
}

export async function createOauthRegisteredClient(payload: OauthRegisteredClient) {
  return requestParsedEntity(oauthRegisteredClientEntitySchema, {
    url: '/oauth-registered-client',
    method: 'POST',
    data: payload,
  })
}

export async function updateOauthRegisteredClient(payload: OauthRegisteredClient) {
  return requestParsedEntity(oauthRegisteredClientEntitySchema, {
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
