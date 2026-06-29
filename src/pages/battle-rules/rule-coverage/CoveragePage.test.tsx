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

function getMockCoverage(overrides?: Partial<BattleRuleCoverageResponse>): BattleRuleCoverageResponse {
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
    items: [
      {
        code: 'final.rule-boundaries',
        name: '最终边界规则',
        category: '最终规则',
        status: 'IMPLEMENTED',
        fixtureNames: ['最终边界公开规则对照'],
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
  expect(screen.getByText('final.rule-boundaries')).toBeInTheDocument();
  expect(screen.getByText('最终边界公开规则对照')).toBeInTheDocument();
  expect(screen.getByText('已实现')).toBeInTheDocument();
  expect(screen.getByText('来源 1')).toBeInTheDocument();
  expect(screen.getByText('覆盖复杂规则交互边界。')).toBeInTheDocument();
});
