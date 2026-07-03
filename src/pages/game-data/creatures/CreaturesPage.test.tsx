import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { creaturesGameDataService } from '../../../services/game-data/creatures';
import { getGameDataReferenceService } from '../../../services/game-data/shared';
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

vi.mock('../../../services/game-data/shared', () => ({
  getGameDataReferenceService: vi.fn(),
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
  vi.mocked(getGameDataReferenceService).mockImplementation((resource) => {
    /**
     * 表格里的外键展示通过统一的轻量引用入口查询；测试需要把这个入口指向页面真实依赖的资料 service，
     * 这样断言覆盖的是用户看到的中文引用文本，而不是实现细节里的原始 ID。
     */
    if (resource === 'species') {
      return speciesGameDataService;
    }
    throw new Error(`未配置的引用资料：${resource}`);
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
