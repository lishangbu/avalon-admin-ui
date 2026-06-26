import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { renderWithQuery } from '../../../../test/render-with-query';
import { systemServices } from '../../../../services/system';
import { UsersPage } from './UsersPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      users: {
        ...actual.systemServices.users,
        list: vi.fn(),
      },
      roles: {
        ...actual.systemServices.roles,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.users.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        username: 'admin',
        displayName: '系统管理员',
        enabled: true,
        accountNonLocked: true,
        roleCodes: ['system-admin'],
      },
    ],
    totalRowCount: 1,
  });
  vi.mocked(systemServices.roles.list).mockResolvedValue({
    rows: [{ id: 1, code: 'system-admin', name: '系统管理员', accessNodeCodes: [] }],
    totalRowCount: 1,
  });
});

it('renders backend users and key management actions', async () => {
  renderWithQuery(<UsersPage />);

  expect(screen.getByRole('heading', { name: '用户管理' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建用户' })).toBeInTheDocument();
  expect(screen.getByLabelText('角色')).toBeInTheDocument();
  expect(screen.getByLabelText('启用状态')).toBeInTheDocument();
  expect(screen.getByLabelText('锁定状态')).toBeInTheDocument();

  await waitFor(() => expect(systemServices.users.list).toHaveBeenCalled());
  expect(await screen.findByText('admin')).toBeInTheDocument();
  expect(screen.getByText('重置密码')).toBeInTheDocument();
  expect(screen.getByText('更新角色')).toBeInTheDocument();
});
