import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestRouter } from '../../../test/TestRouter';
import { beforeEach, expect, it, vi } from 'vitest';
import { creatureStatsGameDataService } from '../../../services/game-data/creature-stats';
import { creaturesGameDataService } from '../../../services/game-data/creatures';
import { getGameDataReferenceService } from '../../../services/game-data/shared';
import { statsGameDataService } from '../../../services/game-data/stats';
import { renderWithQuery } from '../../../test/render-with-query';
import { CreatureStatsPage } from './CreatureStatsPage';

vi.mock('../../../services/game-data/creature-stats', () => ({
  creatureStatsGameDataService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../../../services/game-data/creatures', () => ({
  creaturesGameDataService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../../../services/game-data/stats', () => ({
  statsGameDataService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../../../services/game-data/shared', () => ({
  getGameDataReferenceService: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(creatureStatsGameDataService.list).mockResolvedValue({
    rows: [{ id: 1, creature_id: 1, stat_id: 1, base_value: 45, effort: 0 }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(creaturesGameDataService.get).mockResolvedValue({
    id: 1,
    code: 'bulbasaur',
    name: '妙蛙种子',
  });
  vi.mocked(statsGameDataService.get).mockResolvedValue({
    id: 1,
    code: 'hp',
    name: '体力',
  });
  vi.mocked(creatureStatsGameDataService.remove).mockResolvedValue(undefined);
  vi.mocked(getGameDataReferenceService).mockImplementation((resource) => {
    /**
     * 关系表同时展示多个外键；这里把统一引用入口显式映射到各自资料 service。
     * 测试要验证用户最终看到的是中文维护文本，而不是原始 ID，也不是作为稳定编码存在的英文 code。
     */
    if (resource === 'creatures') {
      return creaturesGameDataService;
    }
    if (resource === 'stats') {
      return statsGameDataService;
    }
    throw new Error(`未配置的引用资料：${resource}`);
  });
});

it('renders reference fields as readable text instead of bare ids', async () => {
  renderWithQuery(
    <TestRouter initialPath="/game-data/creature-stats" path="/game-data/creature-stats">
      <CreatureStatsPage />
    </TestRouter>,
  );

  expect(await screen.findByRole('heading', { name: '精灵数值绑定' })).toBeInTheDocument();

  await waitFor(() =>
    expect(creatureStatsGameDataService.list).toHaveBeenCalledWith(expect.anything()),
  );
  expect(await screen.findByText('妙蛙种子')).toBeInTheDocument();
  expect(await screen.findByText('体力')).toBeInTheDocument();
  expect(screen.queryByText('精灵 ID')).not.toBeInTheDocument();
  expect(screen.queryByText('数值项 ID')).not.toBeInTheDocument();
});

it('uses readable reference labels in delete titles for relation records', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <TestRouter initialPath="/game-data/creature-stats" path="/game-data/creature-stats">
      <CreatureStatsPage />
    </TestRouter>,
  );

  await screen.findByText('妙蛙种子');
  await screen.findByText('体力');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('确认删除「妙蛙种子 / 体力 / 45」？')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creatureStatsGameDataService.remove).toHaveBeenCalledWith(1));
}, 15_000);

it('falls back to reference code when a referenced record has no Chinese label', async () => {
  vi.mocked(statsGameDataService.get).mockResolvedValueOnce({
    id: 1,
    code: 'hp',
  });

  renderWithQuery(
    <TestRouter initialPath="/game-data/creature-stats" path="/game-data/creature-stats">
      <CreatureStatsPage />
    </TestRouter>,
  );

  await screen.findByText('妙蛙种子');
  expect(await screen.findByText('hp')).toBeInTheDocument();
}, 15_000);
