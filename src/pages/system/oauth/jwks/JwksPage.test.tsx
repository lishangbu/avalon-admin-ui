import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { JwksPage } from './JwksPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      jwks: {
        ...actual.systemServices.jwks,
        list: vi.fn(),
        rotate: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.jwks.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        keyId: 'system-jwt-key-20260625',
        active: true,
      },
    ],
    totalRowCount: 1,
  });
  vi.mocked(systemServices.jwks.rotate).mockResolvedValue({
    id: 2,
    keyId: 'system-jwt-key-20260626',
    active: true,
  });
});

it('renders jwks and rotation action', async () => {
  renderWithQuery(<JwksPage />);

  expect(screen.getByRole('heading', { name: 'JWK 管理' })).toBeInTheDocument();
  expect(screen.getByText('轮换 JWK')).toBeInTheDocument();

  await waitFor(() => expect(systemServices.jwks.list).toHaveBeenCalled());
  expect(await screen.findByText('system-jwt-key-20260625')).toBeInTheDocument();
  expect(screen.getAllByText('活跃').length).toBeGreaterThanOrEqual(1);
});
