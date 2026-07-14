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

it('keeps scheduled task identifiers as strings at the request boundary', async () => {
  request.mockResolvedValue({ rows: [], totalRowCount: 0 });
  const services = createSystemServices(request);

  await services.scheduledTasks.executions('9007199254740991', { page: 0, size: 20 });

  expect(request).toHaveBeenCalledWith('GET', '/api/system/scheduler/tasks/{taskId}/executions', {
    params: {
      path: { taskId: '9007199254740991' },
      query: { page: 0, size: 20 },
    },
  });
});

it('keeps user and role identifiers as strings at the request boundary', async () => {
  request.mockResolvedValue({ id: '9007199254740993' });
  const services = createSystemServices(request);

  await services.users.get('9007199254740993');
  await services.roles.get('9007199254740995');

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/system/rbac/users/{userId}', {
    params: { path: { userId: '9007199254740993' } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/system/rbac/roles/{roleId}', {
    params: { path: { roleId: '9007199254740995' } },
  });
});
