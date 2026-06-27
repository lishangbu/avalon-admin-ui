import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { gameDataServices } from '../../services/game-data';
import { renderWithQuery } from '../../test/render-with-query';
import { GameDataTableView } from './GameDataTableView';
import type { GameDataResourceConfig } from './game-data-resources';

vi.mock('../../services/game-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/game-data')>();
  return {
    ...actual,
    gameDataServices: {
      ...actual.gameDataServices,
      list: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    },
  };
});

const creatureResource: GameDataResourceConfig = {
  key: 'creatures',
  path: '/game-data/creatures',
  title: '生物资料',
  description: '维护生物基础资料。',
  searchPlaceholder: '编码或名称',
  fields: [
    { name: 'code', label: '编码', type: 'string', required: true },
    { name: 'name', label: '名称', type: 'string', required: true },
    {
      name: 'species_id',
      label: '种类',
      type: 'long',
      reference: { resource: 'species' },
      filter: true,
    },
    { name: 'enabled', label: '启用', type: 'boolean' },
  ],
};

beforeEach(() => {
  vi.mocked(gameDataServices.list).mockResolvedValue({
    rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子', species_id: 1, enabled: true }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(gameDataServices.get).mockResolvedValue({
    id: 1,
    code: 'bulbasaur-species',
    name: '妙蛙种子种类',
  });
  vi.mocked(gameDataServices.update).mockResolvedValue({
    id: 1,
    code: 'bulbasaur',
    name: '妙蛙种子改',
    species_id: 1,
    enabled: true,
  });
  vi.mocked(gameDataServices.remove).mockResolvedValue(undefined);
});

it('submits edited records with reference field values', async () => {
  const user = userEvent.setup();
  renderWithQuery(<GameDataTableView config={creatureResource} />);

  await screen.findByText('妙蛙种子种类 (bulbasaur-species)');
  await user.click(screen.getByRole('button', { name: '编辑' }));

  expect(await screen.findByText('编辑生物资料')).toBeInTheDocument();
  const nameInput = screen.getByDisplayValue('妙蛙种子');
  await user.clear(nameInput);
  await user.type(nameInput, '妙蛙种子改');
  await user.click(screen.getByRole('button', { name: /保\s*存/ }));

  await waitFor(() =>
    expect(gameDataServices.update).toHaveBeenCalledWith('creatures', 1, {
      code: 'bulbasaur',
      name: '妙蛙种子改',
      species_id: 1,
      enabled: true,
    }),
  );
});

it('confirms deletion before removing records', async () => {
  const user = userEvent.setup();
  renderWithQuery(<GameDataTableView config={creatureResource} />);

  await screen.findByText('妙蛙种子');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('删除资料')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(gameDataServices.remove).toHaveBeenCalledWith('creatures', 1));
});
