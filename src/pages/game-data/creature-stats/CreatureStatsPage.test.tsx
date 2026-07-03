import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
  vi.mocked(getGameDataReferenceService).mockImplementation((resource) => {
    /**
     * 关系表同时展示多个外键；这里把统一引用入口显式映射到各自资料 service，
     * 确保测试验证的是最终可读标签，例如“妙蛙种子 (bulbasaur)”和“体力 (hp)”。
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
    <MemoryRouter initialEntries={['/game-data/creature-stats']}>
      <Routes>
        <Route path="/game-data/creature-stats" element={<CreatureStatsPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '生物数值绑定' })).toBeInTheDocument();

  await waitFor(() =>
    expect(creatureStatsGameDataService.list).toHaveBeenCalledWith(expect.anything()),
  );
  expect(await screen.findByText('妙蛙种子 (bulbasaur)')).toBeInTheDocument();
  expect(await screen.findByText('体力 (hp)')).toBeInTheDocument();
  expect(screen.queryByText('生物 ID')).not.toBeInTheDocument();
  expect(screen.queryByText('数值项 ID')).not.toBeInTheDocument();
});
