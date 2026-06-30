import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import {
  battleRulesServices,
  type BattleRuleCoverageResponse,
} from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { CoveragePage } from './CoveragePage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      coverage: {
        ...actual.battleRulesServices.coverage,
        get: vi.fn(),
      },
    },
  };
});

function getMockCoverage(
  overrides?: Partial<BattleRuleCoverageResponse>,
): BattleRuleCoverageResponse {
  return {
    summary: {
      totalCount: 91,
      implementedCount: 91,
      partialCount: 0,
      plannedCount: 0,
      fixtureCount: 416,
      implementationPercent: 100,
    },
    targetSummary: {
      targetRuleCount: 312,
      coveredRuleCount: 312,
      remainingRuleCount: 0,
      implementationPercent: 100,
      coverageItemCount: 91,
      basis: '现代主系列规则',
    },
    fixtureSummary: {
      runtimeAvailable: true,
      fixtureReferenceCount: 416,
      matchedFixtureCount: 416,
      missingFixtureCount: 0,
      latestPassedCount: 416,
      latestFailedCount: 0,
      latestRunningCount: 0,
      withoutRunCount: 0,
    },
    matrix: [
      {
        category: '最终规则',
        totalCount: 1,
        implementedCount: 1,
        partialCount: 0,
        plannedCount: 0,
        fixtureCount: 1,
        referenceCount: 1,
        implementationPercent: 100,
      },
    ],
    checks: [
      {
        code: 'golden-replay',
        name: 'Golden Replay 对照',
        status: 'PASSED',
        message: '严格 replay 已纳入覆盖报告，并绑定公开对照 fixture。',
      },
    ],
    items: [
      {
        code: 'final.rule-boundaries',
        name: '最终边界规则',
        category: '最终规则',
        status: 'IMPLEMENTED',
        fixtureNames: ['最终边界公开规则对照'],
        fixtures: [
          {
            code: '最终边界公开规则对照',
            fixtureId: 412,
            name: '最终边界公开规则对照',
            enabled: true,
            latestRunCode: 'coverage-run',
            latestRunStatus: 'PASSED',
            latestRunStartedAt: '2026-06-30T07:20:00+08:00',
            missing: false,
          },
        ],
        referenceUrls: ['https://github.com/smogon/pokemon-showdown'],
        note: '覆盖复杂规则交互边界。',
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(battleRulesServices.coverage.get).mockResolvedValue(getMockCoverage());
});

it('renders battle rule coverage summary and public reference rows', async () => {
  renderWithQuery(<CoveragePage />);

  expect(screen.getByRole('heading', { name: '规则覆盖' })).toBeInTheDocument();

  await waitFor(() => expect(battleRulesServices.coverage.get).toHaveBeenCalled());
  expect(await screen.findByText('最终边界规则')).toBeInTheDocument();
  expect(screen.getByText('完整性校验')).toBeInTheDocument();
  expect(screen.getByText('规则覆盖矩阵')).toBeInTheDocument();
  expect(screen.getByText('Golden Replay 对照')).toBeInTheDocument();
  expect(screen.getByText('golden-replay')).toBeInTheDocument();
  expect(screen.getByText('运行态')).toBeInTheDocument();
  expect(screen.getByText('已接入')).toBeInTheDocument();
  expect(screen.getByText('最近通过')).toBeInTheDocument();
  expect(
    screen.getByText('严格 replay 已纳入覆盖报告，并绑定公开对照 fixture。'),
  ).toBeInTheDocument();
  expect(screen.getByText('final.rule-boundaries')).toBeInTheDocument();
  expect(screen.getByText('最终边界公开规则对照')).toBeInTheDocument();
  expect(screen.getAllByText('已实现').length).toBeGreaterThan(0);
  expect(screen.getAllByText('最终规则').length).toBeGreaterThan(0);
  expect(screen.getByText('最终边界公开规则对照').closest('a')).toHaveAttribute(
    'href',
    '/battle-rules/test-runs?fixtureId=412',
  );
  expect(screen.getByText('来源 1')).toBeInTheDocument();
  expect(screen.getByText('覆盖复杂规则交互边界。')).toBeInTheDocument();
});
