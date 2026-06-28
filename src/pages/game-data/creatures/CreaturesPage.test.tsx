import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { creaturesGameDataService } from '../../../services/game-data/creatures';
import { speciesGameDataService } from '../../../services/game-data/species';
import { renderWithQuery } from '../../../test/render-with-query';
import { CreaturesPage } from './CreaturesPage';

vi.mock('../../../services/game-data/creatures', () => ({
  creaturesGameDataService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../../../services/game-data/species', () => ({
  speciesGameDataService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(creaturesGameDataService.list).mockResolvedValue({
    rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子', species_id: 1, enabled: true }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(speciesGameDataService.get).mockResolvedValue({
    id: 1,
    code: 'bulbasaur-species',
    name: '妙蛙种子种类',
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
    expect(creaturesGameDataService.list).toHaveBeenCalledWith(expect.anything()),
  );
  expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
  expect(screen.getByText('妙蛙种子')).toBeInTheDocument();
  expect(await screen.findByText('妙蛙种子种类 (bulbasaur-species)')).toBeInTheDocument();
  expect(screen.queryByText('种类 ID')).not.toBeInTheDocument();
  expect(screen.getByText('编辑')).toBeInTheDocument();
});
