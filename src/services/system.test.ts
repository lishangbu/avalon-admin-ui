import { beforeEach, expect, it, vi } from 'vitest';
import { createSystemServices } from './system';

const request = vi.fn();

beforeEach(() => {
  request.mockReset();
});

it('calls user list endpoint with backend pagination', async () => {
  request.mockResolvedValue({ rows: [], totalRowCount: 0 });
  const services = createSystemServices(request);

  await services.users.list({ page: 0, size: 20, q: 'admin' });

  expect(request).toHaveBeenCalledWith('GET', '/api/system/rbac/users', {
    params: { query: { page: 0, size: 20, q: 'admin' } },
  });
});

it('calls role list endpoint with access node filter', async () => {
  request.mockResolvedValue({ rows: [], totalRowCount: 0 });
  const services = createSystemServices(request);

  await services.roles.list({ page: 0, size: 20, accessNodeCode: 'security:admin' });

  expect(request).toHaveBeenCalledWith('GET', '/api/system/rbac/roles', {
    params: { query: { page: 0, size: 20, accessNodeCode: 'security:admin' } },
  });
});
