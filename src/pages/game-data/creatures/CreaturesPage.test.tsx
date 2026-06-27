import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { gameDataServices } from '../../../services/game-data';
import { renderWithQuery } from '../../../test/render-with-query';
import { CreaturesPage } from './CreaturesPage';

vi.mock('../../../services/game-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/game-data')>();
  return {
    ...actual,
    gameDataServices: {
      ...actual.gameDataServices,
      list: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(gameDataServices.list).mockResolvedValue({
    rows: [{ id: 1, fields: { code: 'bulbasaur', name: '妙蛙种子', enabled: true } }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
});

it('renders configured game data resource table', async () => {
  renderWithQuery(
    <MemoryRouter initialEntries={['/game-data/creatures']}>
      <Routes>
        <Route path="/game-data/creatures" element={<CreaturesPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '生物资料' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建资料' })).toBeInTheDocument();

  await waitFor(() =>
    expect(gameDataServices.list).toHaveBeenCalledWith('creatures', expect.anything()),
  );
  expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
  expect(screen.getByText('妙蛙种子')).toBeInTheDocument();
  expect(screen.getByText('编辑')).toBeInTheDocument();
});
