import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { RolesPage } from './RolesPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      roles: {
        ...actual.systemServices.roles,
        list: vi.fn(),
      },
      accessNodes: {
        ...actual.systemServices.accessNodes,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.roles.list).mockResolvedValue({
    rows: [
      { id: 1, code: 'system-admin', name: '系统管理员', accessNodeCodes: ['security:admin'] },
    ],
    totalRowCount: 1,
  });
  vi.mocked(systemServices.accessNodes.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'security:admin',
        name: '系统管理 API',
        type: 'API',
        sortOrder: 1,
        visible: false,
        enabled: true,
      },
    ],
    totalRowCount: 1,
  });
});

it('renders backend roles and access node filter', async () => {
  renderWithQuery(<RolesPage />);

  expect(screen.getByRole('heading', { name: '角色管理' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建角色' })).toBeInTheDocument();
  expect(screen.getByLabelText('访问节点')).toBeInTheDocument();

  await waitFor(() => expect(systemServices.roles.list).toHaveBeenCalled());
  expect(await screen.findByText('system-admin')).toBeInTheDocument();
  expect(screen.getByText('编辑')).toBeInTheDocument();
});
