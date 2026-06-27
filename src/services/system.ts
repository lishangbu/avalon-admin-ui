import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type UserResponse = components['schemas']['UserResponse'];
export type RoleResponse = components['schemas']['RoleResponse'];
export type AccessNodeResponse = components['schemas']['AccessNodeResponse'];
export type OAuthClientResponse = components['schemas']['OAuthClientResponse'];
export type OAuthJwkResponse = components['schemas']['OAuthJwkResponse'];
export type OAuthTokenResponse = components['schemas']['OAuthTokenResponse'];
export type ScheduledTaskResponse = components['schemas']['ManagedScheduledTaskResponse'];
export type ScheduledTaskExecutionResponse =
  components['schemas']['ManagedScheduledTaskExecutionResponse'];
export type TriggerScheduledTaskResponse = components['schemas']['TriggerScheduledTaskResponse'];

export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type ResetUserPasswordRequest = components['schemas']['ResetUserPasswordRequest'];
export type UpdateUserRolesRequest = components['schemas']['UpdateUserRolesRequest'];
export type CreateRoleRequest = components['schemas']['CreateRoleRequest'];
export type UpdateRoleRequest = components['schemas']['UpdateRoleRequest'];
export type CreateOAuthClientRequest = components['schemas']['CreateOAuthClientRequest'];
export type UpdateOAuthClientRequest = components['schemas']['UpdateOAuthClientRequest'];
export type ResetOAuthClientSecretRequest = components['schemas']['ResetOAuthClientSecretRequest'];
export type ScheduledTaskRequestPayload = components['schemas']['ScheduledTaskRequestPayload'];
export type TriggerScheduledTaskRequest = components['schemas']['TriggerScheduledTaskRequest'];

export type PageUserResponse = components['schemas']['PageUserResponse'];
export type PageRoleResponse = components['schemas']['PageRoleResponse'];
export type PageAccessNodeResponse = components['schemas']['PageAccessNodeResponse'];
export type PageOAuthClientResponse = components['schemas']['PageOAuthClientResponse'];
export type PageOAuthJwkResponse = components['schemas']['PageOAuthJwkResponse'];
export type PageOAuthTokenResponse = components['schemas']['PageOAuthTokenResponse'];
export type PageScheduledTaskResponse = components['schemas']['PageManagedScheduledTaskResponse'];
export type PageScheduledTaskExecutionResponse =
  components['schemas']['PageManagedScheduledTaskExecutionResponse'];

export interface PageQuery {
  q?: string;
  page?: number;
  size?: number;
}

export interface UserListQuery extends PageQuery {
  roleCode?: string;
  enabled?: boolean;
  accountNonLocked?: boolean;
}

export interface RoleListQuery extends PageQuery {
  accessNodeCode?: string;
}

export interface AccessNodeListQuery extends PageQuery {
  codePrefix?: string;
  type?: string;
  visible?: boolean;
  enabled?: boolean;
}

export interface OAuthTokenListQuery extends PageQuery {
  clientId?: string;
  principalName?: string;
}

/**
 * 创建系统管理 API 集合。
 *
 * request 作为参数注入，方便测试中验证路径和参数；生产环境默认使用统一的 apiRequest。
 * 每个资源函数只表达后端契约，不处理页面状态。
 */
export function createSystemServices(request: ApiRequest = apiRequest) {
  return {
    users: {
      list: (query: UserListQuery) =>
        request<PageUserResponse>('GET', '/api/system/rbac/users', {
          params: { query },
        }),
      get: (userId: number) =>
        request<UserResponse>('GET', '/api/system/rbac/users/{userId}', {
          params: { path: { userId } },
        }),
      create: (body: CreateUserRequest) =>
        request<UserResponse>('POST', '/api/system/rbac/users', { body }),
      enable: (userId: number) =>
        request<UserResponse>('POST', '/api/system/rbac/users/{userId}/enable', {
          params: { path: { userId } },
        }),
      disable: (userId: number) =>
        request<UserResponse>('POST', '/api/system/rbac/users/{userId}/disable', {
          params: { path: { userId } },
        }),
      lock: (userId: number) =>
        request<UserResponse>('POST', '/api/system/rbac/users/{userId}/lock', {
          params: { path: { userId } },
        }),
      unlock: (userId: number) =>
        request<UserResponse>('POST', '/api/system/rbac/users/{userId}/unlock', {
          params: { path: { userId } },
        }),
      resetPassword: (userId: number, body: ResetUserPasswordRequest) =>
        request<UserResponse>('PUT', '/api/system/rbac/users/{userId}/password', {
          params: { path: { userId } },
          body,
        }),
      updateRoles: (userId: number, body: UpdateUserRolesRequest) =>
        request<UserResponse>('PUT', '/api/system/rbac/users/{userId}/roles', {
          params: { path: { userId } },
          body,
        }),
    },
    roles: {
      list: (query: RoleListQuery) =>
        request<PageRoleResponse>('GET', '/api/system/rbac/roles', {
          params: { query },
        }),
      get: (roleId: number) =>
        request<RoleResponse>('GET', '/api/system/rbac/roles/{roleId}', {
          params: { path: { roleId } },
        }),
      create: (body: CreateRoleRequest) =>
        request<RoleResponse>('POST', '/api/system/rbac/roles', { body }),
      update: (roleId: number, body: UpdateRoleRequest) =>
        request<RoleResponse>('PUT', '/api/system/rbac/roles/{roleId}', {
          params: { path: { roleId } },
          body,
        }),
    },
    accessNodes: {
      list: (query: AccessNodeListQuery) =>
        request<PageAccessNodeResponse>('GET', '/api/system/rbac/access-nodes', {
          params: { query },
        }),
      get: (accessNodeCode: string) =>
        request<AccessNodeResponse>('GET', '/api/system/rbac/access-nodes/{accessNodeCode}', {
          params: { path: { accessNodeCode } },
        }),
    },
    oauthClients: {
      list: (query: PageQuery) =>
        request<PageOAuthClientResponse>('GET', '/api/system/oauth/clients', {
          params: { query },
        }),
      get: (clientId: string) =>
        request<OAuthClientResponse>('GET', '/api/system/oauth/clients/{clientId}', {
          params: { path: { clientId } },
        }),
      create: (body: CreateOAuthClientRequest) =>
        request<OAuthClientResponse>('POST', '/api/system/oauth/clients', { body }),
      update: (clientId: string, body: UpdateOAuthClientRequest) =>
        request<OAuthClientResponse>('PUT', '/api/system/oauth/clients/{clientId}', {
          params: { path: { clientId } },
          body,
        }),
      resetSecret: (clientId: string, body: ResetOAuthClientSecretRequest) =>
        request<OAuthClientResponse>('PUT', '/api/system/oauth/clients/{clientId}/secret', {
          params: { path: { clientId } },
          body,
        }),
    },
    jwks: {
      list: (query: PageQuery) =>
        request<PageOAuthJwkResponse>('GET', '/api/system/oauth/jwks', {
          params: { query },
        }),
      get: (keyId: string) =>
        request<OAuthJwkResponse>('GET', '/api/system/oauth/jwks/{keyId}', {
          params: { path: { keyId } },
        }),
      rotate: () =>
        request<OAuthJwkResponse | undefined>('POST', '/api/system/oauth/jwks/rotation', {
          allowEmptyResponse: true,
        }),
    },
    oauthTokens: {
      list: (query: OAuthTokenListQuery) =>
        request<PageOAuthTokenResponse>('GET', '/api/system/oauth/tokens', {
          params: { query },
        }),
      get: (authorizationId: string) =>
        request<OAuthTokenResponse>('GET', '/api/system/oauth/tokens/{authorizationId}', {
          params: { path: { authorizationId } },
        }),
      revoke: (authorizationId: string) =>
        request<OAuthTokenResponse>('POST', '/api/system/oauth/tokens/{authorizationId}/revoke', {
          params: { path: { authorizationId } },
        }),
    },
    scheduledTasks: {
      list: (query: PageQuery) =>
        request<PageScheduledTaskResponse>('GET', '/api/system/scheduler/tasks', {
          params: { query },
        }),
      get: (taskId: number) =>
        request<ScheduledTaskResponse>('GET', '/api/system/scheduler/tasks/{taskId}', {
          params: { path: { taskId } },
        }),
      create: (body: ScheduledTaskRequestPayload) =>
        request<ScheduledTaskResponse>('POST', '/api/system/scheduler/tasks', { body }),
      update: (taskId: number, body: ScheduledTaskRequestPayload) =>
        request<ScheduledTaskResponse>('PUT', '/api/system/scheduler/tasks/{taskId}', {
          params: { path: { taskId } },
          body,
        }),
      enable: (taskId: number) =>
        request<ScheduledTaskResponse>('POST', '/api/system/scheduler/tasks/{taskId}/enable', {
          params: { path: { taskId } },
        }),
      disable: (taskId: number) =>
        request<ScheduledTaskResponse>('POST', '/api/system/scheduler/tasks/{taskId}/disable', {
          params: { path: { taskId } },
        }),
      trigger: (taskId: number, body: TriggerScheduledTaskRequest) =>
        request<TriggerScheduledTaskResponse>(
          'POST',
          '/api/system/scheduler/tasks/{taskId}/trigger',
          {
            params: { path: { taskId } },
            body,
          },
        ),
      remove: (taskId: number) =>
        request<void>('DELETE', '/api/system/scheduler/tasks/{taskId}', {
          params: { path: { taskId } },
        }),
      executions: (taskId: number, query: PageQuery) =>
        request<PageScheduledTaskExecutionResponse>(
          'GET',
          '/api/system/scheduler/tasks/{taskId}/executions',
          {
            params: { path: { taskId }, query },
          },
        ),
    },
  };
}

export const systemServices = createSystemServices();
