import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { OAuthTokensPage } from './OAuthTokensPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      oauthTokens: {
        ...actual.systemServices.oauthTokens,
        list: vi.fn(),
        revoke: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.oauthTokens.list).mockResolvedValue({
    rows: [
      {
        id: 'authorization-1',
        registeredClientId: '501',
        clientId: 'system-admin-opaque',
        clientName: '系统管理 Opaque Client',
        principalName: 'admin',
        authorizationGrantType: 'urn:security:params:oauth:grant-type:password',
        authorizedScopes: ['security:admin'],
        accessTokenScopes: ['security:admin'],
        accessTokenType: 'Bearer',
        accessTokenIssuedAt: '2026-06-27T01:00:00Z',
        accessTokenExpiresAt: '2026-06-27T02:00:00Z',
        status: 'ACTIVE',
        active: true,
      },
    ],
    totalRowCount: 1,
  });
  vi.mocked(systemServices.oauthTokens.revoke).mockResolvedValue({
    id: 'authorization-1',
    registeredClientId: '501',
    clientId: 'system-admin-opaque',
    principalName: 'admin',
    authorizationGrantType: 'urn:security:params:oauth:grant-type:password',
    authorizedScopes: ['security:admin'],
    accessTokenScopes: ['security:admin'],
    status: 'REVOKED',
    active: false,
  });
});

it('renders oauth tokens with revoke action', async () => {
  renderWithQuery(<OAuthTokensPage />);

  expect(screen.getByRole('heading', { name: '令牌管理' })).toBeInTheDocument();

  await waitFor(() => expect(systemServices.oauthTokens.list).toHaveBeenCalled());
  expect(await screen.findByText('system-admin-opaque')).toBeInTheDocument();
  expect(screen.getByText('系统管理 Opaque Client')).toBeInTheDocument();
  expect(screen.getByText('有效')).toBeInTheDocument();
  expect(screen.getByText('撤销')).toBeInTheDocument();
});
