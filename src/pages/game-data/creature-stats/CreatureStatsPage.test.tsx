import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { gameDataServices } from '../../../services/game-data';
import { renderWithQuery } from '../../../test/render-with-query';
import { CreatureStatsPage } from './CreatureStatsPage';

vi.mock('../../../services/game-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/game-data')>();
  return {
    ...actual,
    gameDataServices: {
      ...actual.gameDataServices,
      list: vi.fn(),
      get: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(gameDataServices.list).mockResolvedValue({
    rows: [{ id: 1, creature_id: 1, stat_id: 1, base_value: 45, effort: 0 }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(gameDataServices.get).mockImplementation(async (resource, id) => {
    if (resource === 'creatures' && id === 1) {
      return { id: 1, code: 'bulbasaur', name: '妙蛙种子' };
    }
    if (resource === 'stats' && id === 1) {
      return { id: 1, code: 'hp', name: '体力' };
    }
    return { id };
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
    expect(gameDataServices.list).toHaveBeenCalledWith('creature-stats', expect.anything()),
  );
  expect(await screen.findByText('妙蛙种子 (bulbasaur)')).toBeInTheDocument();
  expect(await screen.findByText('体力 (hp)')).toBeInTheDocument();
  expect(screen.queryByText('生物 ID')).not.toBeInTheDocument();
  expect(screen.queryByText('数值项 ID')).not.toBeInTheDocument();
});
