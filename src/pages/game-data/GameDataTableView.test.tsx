import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { renderWithQuery } from '../../test/render-with-query';
import { GameDataTableView } from './GameDataTableView';
import type { GameDataResourceKey, GameDataResourceService } from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';

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

const creatureService: GameDataResourceService = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

const creatureStatResource: GameDataResourceConfig = {
  key: 'creature-stats',
  path: '/game-data/creature-stats',
  title: '能力资料',
  description: '维护生物能力资料。',
  searchPlaceholder: '生物或能力',
  displayFields: ['creature_id', 'stat_id', 'base_value'],
  fields: [
    {
      name: 'creature_id',
      label: '生物',
      type: 'long',
      reference: { resource: 'creatures' },
    },
    {
      name: 'stat_id',
      label: '能力',
      type: 'long',
      reference: { resource: 'stats' },
    },
    { name: 'base_value', label: '基础值', type: 'int' },
  ],
};

const creatureStatService: GameDataResourceService = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

const speciesService: GameDataResourceService = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

const statService: GameDataResourceService = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

function resolveReferenceService(resource: GameDataResourceKey): GameDataResourceService {
  if (resource === 'species') {
    return speciesService;
  }
  if (resource === 'stats') {
    return statService;
  }
  return creatureService;
}

beforeEach(() => {
  vi.mocked(creatureService.list).mockResolvedValue({
    rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子', species_id: 1, enabled: true }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(speciesService.get).mockResolvedValue({
    id: 1,
    code: 'bulbasaur-species',
    name: '妙蛙种子种类',
  });
  vi.mocked(creatureService.update).mockResolvedValue({
    id: 1,
    code: 'bulbasaur',
    name: '妙蛙种子改',
    species_id: 1,
    enabled: true,
  });
  vi.mocked(creatureService.remove).mockResolvedValue(undefined);
  vi.mocked(creatureStatService.list).mockResolvedValue({
    rows: [{ id: 10, creature_id: 1, stat_id: 2, base_value: 45 }],
    totalRowCount: 1,
    totalPageCount: 1,
    page: 0,
    size: 20,
  });
  vi.mocked(creatureService.get).mockResolvedValue({
    id: 1,
    code: 'bulbasaur',
    name: '妙蛙种子',
  });
  vi.mocked(statService.get).mockResolvedValue({
    id: 2,
    code: 'speed',
    name: '速度',
  });
  vi.mocked(creatureStatService.remove).mockResolvedValue(undefined);
});

it('submits edited records with reference field values', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <GameDataTableView
      config={creatureResource}
      service={creatureService}
      referenceServiceResolver={resolveReferenceService}
    />,
  );

  await screen.findByText('妙蛙种子种类');
  await user.click(screen.getByRole('button', { name: '编辑' }));

  expect(await screen.findByText('编辑生物资料')).toBeInTheDocument();
  const nameInput = screen.getByDisplayValue('妙蛙种子');
  await user.clear(nameInput);
  await user.type(nameInput, '妙蛙种子改');
  await user.click(screen.getByRole('button', { name: /保\s*存/ }));

  await waitFor(() =>
    expect(creatureService.update).toHaveBeenCalledWith(1, {
      code: 'bulbasaur',
      name: '妙蛙种子改',
      species_id: 1,
      enabled: true,
    }),
  );
});

it('confirms deletion before removing records', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <GameDataTableView
      config={creatureResource}
      service={creatureService}
      referenceServiceResolver={resolveReferenceService}
    />,
  );

  await screen.findByText('妙蛙种子');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('删除资料')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creatureService.remove).toHaveBeenCalledWith(1));
});

it('uses reference labels in delete titles for relation records without name', async () => {
  const user = userEvent.setup();
  renderWithQuery(
    <GameDataTableView
      config={creatureStatResource}
      service={creatureStatService}
      referenceServiceResolver={resolveReferenceService}
    />,
  );

  await screen.findByText('妙蛙种子');
  await screen.findByText('速度');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('确认删除「妙蛙种子 / 速度 / 45」？')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creatureStatService.remove).toHaveBeenCalledWith(10));
});

it('falls back to reference code when a referenced record has no Chinese label', async () => {
  vi.mocked(statService.get).mockResolvedValueOnce({
    id: 2,
    code: 'speed',
  });

  renderWithQuery(
    <GameDataTableView
      config={creatureStatResource}
      service={creatureStatService}
      referenceServiceResolver={resolveReferenceService}
    />,
  );

  await screen.findByText('妙蛙种子');
  expect(await screen.findByText('speed')).toBeInTheDocument();
});
