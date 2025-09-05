export function listOauth2RegisteredClients() {
  return alovaInstance.Get<ApiResult<Oauth2RegisteredClientInfo[]>>(
    '/oauth2-registered-client/list',
    {
      meta: {
        authRole: null,
      },
    }
  )
}
