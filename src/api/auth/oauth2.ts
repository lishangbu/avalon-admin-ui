export const login = (loginData: LoginForm) => {
  const { username, password } = loginData
  return alovaInstance.Request<ApiResult<TokenInfo>>({
    url: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic dGVzdDp0ZXN0',
    },
    params: {
      username,
      password,
      grant_type: loginData.grantType,
    },
    meta: {
      authRole: 'login',
    },
  })
}


export const logout = () => {
  return alovaInstance.Request<ApiResult<TokenInfo>>({
    url: '/token/logout',
    method: 'DELETE',
    meta: {
      authRole: 'logout',
    },
  })
}
