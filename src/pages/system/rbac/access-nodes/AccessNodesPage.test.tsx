import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { AccessNodesPage } from './AccessNodesPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      accessNodes: {
        ...actual.systemServices.accessNodes,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.accessNodes.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'system.rbac.users',
        name: '用户管理',
        type: 'ROUTE',
        sortOrder: 10,
        visible: true,
        enabled: true,
      },
    ],
    totalRowCount: 1,
  });
});

it('renders backend access nodes and filter controls', async () => {
  renderWithQuery(<AccessNodesPage />);

  expect(screen.getByRole('heading', { name: '访问节点' })).toBeInTheDocument();
  expect(screen.getByLabelText('节点类型')).toBeInTheDocument();
  expect(screen.getByLabelText('可见状态')).toBeInTheDocument();
  expect(screen.getByLabelText('启用状态')).toBeInTheDocument();

  await waitFor(() => expect(systemServices.accessNodes.list).toHaveBeenCalled());
  expect(await screen.findByText('system.rbac.users')).toBeInTheDocument();
  expect(screen.getByText('详情')).toBeInTheDocument();
});
