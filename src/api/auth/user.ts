export function getUserInfo() {
  return alovaInstance.Get<ApiResult<UserInfo>>(
    '/user/info'
  )
}
