import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestRouter } from '../../../test/TestRouter';
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
  vi.clearAllMocks();
  vi.mocked(creaturesGameDataService.list).mockResolvedValue({
    rows: [
      {
        id: '1',
        code: 'bulbasaur',
        name: '妙蛙种子',
        species_id: '1',
        inherits_from_creature_id: '2',
        enabled: true,
      },
    ],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(speciesGameDataService.get).mockResolvedValue({
    id: '1',
    code: 'bulbasaur-species',
    name: '妙蛙种子种类',
  });
  vi.mocked(creaturesGameDataService.get).mockResolvedValue({
    id: '2',
    code: 'ivysaur',
    name: '妙蛙草',
    species_id: '1',
  });
  vi.mocked(creaturesGameDataService.update).mockResolvedValue({
    id: '1',
    code: 'bulbasaur',
    name: '妙蛙种子改',
    species_id: '1',
    inherits_from_creature_id: '2',
    enabled: true,
  });
  vi.mocked(creaturesGameDataService.remove).mockResolvedValue(undefined);
  vi.mocked(getGameDataReferenceService).mockImplementation((resource) => {
    /**
     * 表格里的外键展示通过统一的轻量引用入口查询；测试需要把这个入口指向页面真实依赖的资料 service，
     * 这样断言覆盖的是用户看到的中文引用文本，而不是实现细节里的原始 ID。
     */
    if (resource === 'species') {
      return speciesGameDataService;
    }
    if (resource === 'creatures') {
      return creaturesGameDataService;
    }
    throw new Error(`未配置的引用资料：${resource}`);
  });
});

it('renders configured game data resource table', async () => {
  renderWithQuery(
    <TestRouter initialPath="/game-data/creatures" path="/game-data/creatures">
      <CreaturesPage />
    </TestRouter>,
  );

  expect(await screen.findByRole('heading', { name: '精灵资料' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '新建资料' })).toBeInTheDocument();

  await waitFor(() =>
    expect(creaturesGameDataService.list).toHaveBeenCalledWith(expect.anything()),
  );
  expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
  expect(screen.getByText('妙蛙种子')).toBeInTheDocument();
  expect(await screen.findByText('妙蛙种子种类')).toBeInTheDocument();
  expect(await screen.findByText('妙蛙草')).toBeInTheDocument();
  expect(screen.queryByText('种类 ID')).not.toBeInTheDocument();
  expect(screen.getByText('编辑')).toBeInTheDocument();
});

it('keeps backend long reference identifiers lossless', async () => {
  const unsafeLongId = '9007199254740993';
  vi.mocked(creaturesGameDataService.list).mockResolvedValue({
    rows: [
      {
        id: unsafeLongId,
        code: 'precision-creature',
        name: '精度测试精灵',
        species_id: unsafeLongId,
        enabled: true,
      },
    ],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(speciesGameDataService.get).mockResolvedValue({
    id: unsafeLongId,
    code: 'precision-species',
    name: '精度测试种类',
  });

  renderWithQuery(
    <TestRouter initialPath="/game-data/creatures" path="/game-data/creatures">
      <CreaturesPage />
    </TestRouter>,
  );

  expect(await screen.findByText('精度测试种类')).toBeInTheDocument();
  expect(speciesGameDataService.get).toHaveBeenCalledWith(unsafeLongId);
});

it('submits edited records with reference field values', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <TestRouter initialPath="/game-data/creatures" path="/game-data/creatures">
      <CreaturesPage />
    </TestRouter>,
  );

  await screen.findByText('妙蛙种子种类');
  await user.click(screen.getByRole('button', { name: '编辑' }));

  expect(await screen.findByText('编辑精灵资料')).toBeInTheDocument();
  const nameInput = screen.getByDisplayValue('妙蛙种子');
  await user.clear(nameInput);
  await user.type(nameInput, '妙蛙种子改');
  await user.click(screen.getByRole('button', { name: /保\s*存/ }));

  await waitFor(() =>
    expect(creaturesGameDataService.update).toHaveBeenCalledWith('1', {
      base_experience: null,
      code: 'bulbasaur',
      default_form: null,
      inherits_from_creature_id: '2',
      name: '妙蛙种子改',
      species_id: '1',
      height: null,
      sort_order: null,
      weight: null,
      enabled: true,
    }),
  );
}, 15_000);

it('confirms deletion before removing records', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <TestRouter initialPath="/game-data/creatures" path="/game-data/creatures">
      <CreaturesPage />
    </TestRouter>,
  );

  await screen.findByText('妙蛙种子种类');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('删除资料')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creaturesGameDataService.remove).toHaveBeenCalledWith('1'));
}, 15_000);
