export const IAM_PERMISSION_CODES = {
  role: {
    query: 'iam:role:query',
    create: 'iam:role:create',
    update: 'iam:role:update',
    delete: 'iam:role:delete',
  },
  menu: {
    query: 'iam:menu:query',
    create: 'iam:menu:create',
    update: 'iam:menu:update',
    delete: 'iam:menu:delete',
  },
  permission: {
    query: 'iam:permission:query',
    create: 'iam:permission:create',
    update: 'iam:permission:update',
    delete: 'iam:permission:delete',
  },
  user: {
    query: 'iam:user:query',
    create: 'iam:user:create',
    update: 'iam:user:update',
    delete: 'iam:user:delete',
  },
  oauthClient: {
    query: 'iam:oauth-client:query',
    create: 'iam:oauth-client:create',
    update: 'iam:oauth-client:update',
    delete: 'iam:oauth-client:delete',
  },
} as const
