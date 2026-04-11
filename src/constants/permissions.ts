export const SYSTEM_PERMISSION_CODES = {
  role: {
    query: 'system:role:query',
    create: 'system:role:create',
    update: 'system:role:update',
    delete: 'system:role:delete',
  },
  menu: {
    query: 'system:menu:query',
    create: 'system:menu:create',
    update: 'system:menu:update',
    delete: 'system:menu:delete',
  },
  permission: {
    query: 'system:permission:query',
    create: 'system:permission:create',
    update: 'system:permission:update',
    delete: 'system:permission:delete',
  },
  user: {
    query: 'system:user:query',
    create: 'system:user:create',
    update: 'system:user:update',
    delete: 'system:user:delete',
  },
  oauthClient: {
    query: 'system:oauth-client:query',
    create: 'system:oauth-client:create',
    update: 'system:oauth-client:update',
    delete: 'system:oauth-client:delete',
  },
} as const
