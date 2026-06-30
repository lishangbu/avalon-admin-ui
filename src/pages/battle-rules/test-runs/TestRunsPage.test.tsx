import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { TestRunsPage } from './TestRunsPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      fixtures: {
        ...actual.battleRulesServices.fixtures,
        list: vi.fn(),
      },
      testRuns: {
        ...actual.battleRulesServices.testRuns,
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.fixtures.list).mockResolvedValue({
    rows: [
      {
        id: 400,
        code: 'final-rule-boundaries',
        name: '最终边界公开规则对照',
        category: 'FINAL',
        fixtureType: 'PUBLIC_REFERENCE',
        inputSummary: '复杂边界输入',
        expectedSummary: '公开对照一致',
        enabled: true,
        sortOrder: 400,
      },
    ],
    totalRowCount: 1,
    totalPageCount: 1,
  });
  vi.mocked(battleRulesServices.testRuns.list).mockResolvedValue({
    rows: [
      {
        id: 400,
        runCode: 'final-boundary-coverage-20260629-1',
        fixtureId: 400,
        runStatus: 'PASSED',
        executor: 'gradle',
        command: './gradlew :battle-engine:test',
        engineCommit: '41e6b9c',
        startedAt: '2026-06-29T23:59:00+08:00',
        finishedAt: '2026-06-30T00:00:00+08:00',
        durationMs: 60000,
        assertionCount: 12,
        sortOrder: 400,
      },
    ],
    totalRowCount: 1,
    totalPageCount: 1,
  });
});

it('renders battle rule test run records with fixture text labels', async () => {
  renderWithQuery(
    <MemoryRouter initialEntries={['/battle-rules/test-runs?fixtureId=400&runStatus=PASSED']}>
      <TestRunsPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '测试运行结果' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /新建结果/ })).toBeInTheDocument();

  await waitFor(() =>
    expect(battleRulesServices.testRuns.list).toHaveBeenCalledWith({
      fixtureId: 400,
      runStatus: 'PASSED',
      page: 0,
      size: 20,
    }),
  );
  expect(await screen.findByText('final-boundary-coverage-20260629-1')).toBeInTheDocument();
  expect(
    await screen.findAllByText('最终边界公开规则对照（final-rule-boundaries）'),
  ).not.toHaveLength(0);
  expect(screen.getAllByText('通过')).not.toHaveLength(0);
  expect(screen.getByText('gradle')).toBeInTheDocument();
  expect(screen.getByText('./gradlew :battle-engine:test')).toBeInTheDocument();
  expect(screen.getByText('41e6b9c')).toBeInTheDocument();
});
