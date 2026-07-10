import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { systemServices } from '../../../../services/system';
import { renderWithQuery } from '../../../../test/render-with-query';
import { ScheduledTasksPage } from './ScheduledTasksPage';

vi.mock('../../../../services/system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../services/system')>();
  return {
    ...actual,
    systemServices: {
      ...actual.systemServices,
      scheduledTasks: {
        ...actual.systemServices.scheduledTasks,
        list: vi.fn(),
        executions: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(systemServices.scheduledTasks.list).mockResolvedValue({
    rows: [
      {
        id: '1',
        code: 'cleanup-expired-token',
        handlerCode: 'token.cleanup',
        name: '清理过期 token',
        groupName: 'system',
        scheduleType: 'CRON',
        cronExpression: '0 0/5 * * * ?',
        timeZone: 'UTC',
        payload: { scope: {} },
        enabled: true,
        triggerState: 'NORMAL',
        lastExecutionStatus: 'SUCCESS',
      },
    ],
    totalRowCount: 1,
  });
  vi.mocked(systemServices.scheduledTasks.executions).mockResolvedValue({
    rows: [],
    totalRowCount: 0,
  });
});

it('renders scheduled tasks and operational actions', async () => {
  renderWithQuery(<ScheduledTasksPage />);

  expect(screen.getByRole('heading', { name: '定时任务' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建任务' })).toBeInTheDocument();

  await waitFor(() => expect(systemServices.scheduledTasks.list).toHaveBeenCalled());
  expect(await screen.findByText('cleanup-expired-token')).toBeInTheDocument();
  expect(screen.getByText('触发')).toBeInTheDocument();
  expect(screen.getByText('执行记录')).toBeInTheDocument();
});
