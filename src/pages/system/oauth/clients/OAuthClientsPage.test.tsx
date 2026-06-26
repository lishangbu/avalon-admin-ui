import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { OAuthClientsPage } from './OAuthClientsPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      oauthClients: {
        ...actual.systemServices.oauthClients,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.oauthClients.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        clientId: 'system-admin-jwt',
        clientName: '系统管理 JWT Client',
        clientAuthenticationMethods: ['client_secret_basic'],
        authorizationGrantTypes: ['urn:security:params:oauth:grant-type:password'],
        scopes: ['security:admin'],
        accessTokenFormat: 'self-contained',
        accessTokenTtlSeconds: 3600,
        refreshTokenTtlSeconds: 7200,
        createdAt: '2026-06-26T01:00:00Z',
        updatedAt: '2026-06-26T01:00:00Z',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders oauth clients and write operations', async () => {
  renderWithQuery(<OAuthClientsPage />);

  expect(screen.getByRole('heading', { name: 'OAuth Client' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建 Client' })).toBeInTheDocument();

  await waitFor(() => expect(systemServices.oauthClients.list).toHaveBeenCalled());
  expect(await screen.findByText('system-admin-jwt')).toBeInTheDocument();
  expect(screen.getByText('编辑')).toBeInTheDocument();
  expect(screen.getByText('重置 secret')).toBeInTheDocument();
});
