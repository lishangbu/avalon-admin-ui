import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { beforeEach, expect, it, vi } from 'vitest';
import { renderWithQuery } from '../../test/render-with-query';
import { EntityDrawer } from '../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from './GameDataCrudHeader';
import { GameDataEditModal } from './GameDataEditModal';
import { GameDataFilterBar } from './GameDataFilterBar';
import {
  fieldColumnWidth,
  fieldLabel,
  formatRecordTitle,
  queryErrorMessage,
  renderFieldValue,
  tableScrollWidth,
} from './GameDataCrudFormatters';
import { useGameDataCrudPage } from './useGameDataCrudPage';
import type {
  GameDataRecord,
  GameDataResourceKey,
  GameDataResourceService,
} from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';
import type { GameDataRecordTableProps } from './GameDataCrudTypes';

const creatureResource: GameDataResourceConfig = {
  key: 'creatures',
  path: '/game-data/creatures',
  title: '精灵资料',
  description: '维护精灵基础资料。',
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
  description: '维护精灵能力资料。',
  searchPlaceholder: '精灵或能力',
  displayFields: ['creature_id', 'stat_id', 'base_value'],
  fields: [
    {
      name: 'creature_id',
      label: '精灵',
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

function TestGameDataPage({
  config,
  service,
}: {
  config: GameDataResourceConfig;
  service: GameDataResourceService;
}) {
  const crud = useGameDataCrudPage({
    config,
    service,
    referenceServiceResolver: resolveReferenceService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <TestRecordTable config={config} {...crud.recordTableProps} />
      <EntityDrawer {...crud.detailDrawerProps} />
      <GameDataEditModal {...crud.editModalProps} />
    </div>
  );
}

/**
 * 组合测试使用的页面内表格夹具。
 *
 * 生产页面已经把表格实现拆回各自的 `*Page.tsx`，这里保留一个测试局部版本，只负责验证 hook、筛选、引用展示、
 * 删除确认和编辑弹窗之间的协作。它不会被真实路由引用，也不会重新形成可被业务页面复用的大一统表格组件。
 * 表格内部仍调用同一组格式化函数，测试才能覆盖“引用 ID 展示为中文名称”和“删除确认使用可读标题”这些公共规则。
 */
function TestRecordTable({
  config,
  rows,
  totalRowCount,
  page,
  loading,
  error,
  referenceLookup,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: GameDataRecordTableProps & { config: GameDataResourceConfig }) {
  const columns: ColumnsType<GameDataRecord> = [
    ...config.fields.map((field, index) => ({
      title: fieldLabel(field),
      dataIndex: field.name,
      width: fieldColumnWidth(field),
      fixed: index === 0 ? ('left' as const) : undefined,
      render: (value: unknown) => renderFieldValue(field, value, referenceLookup),
    })),
    {
      title: '操作',
      key: 'actions',
      width: 170,
      fixed: 'right' as const,
      render: (_: unknown, record: GameDataRecord) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => onDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除资料"
            description={`确认删除${formatRecordTitle(config, record, referenceLookup)}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => onDelete(record)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card size="small">
      {error ? (
        <Alert
          className="!mb-3"
          type="error"
          showIcon
          title="资料加载失败"
          description={queryErrorMessage(error)}
        />
      ) : null}
      <Table<GameDataRecord>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        scroll={{ x: tableScrollWidth(config) }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: totalRowCount,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
      />
    </Card>
  );
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
  renderWithQuery(<TestGameDataPage config={creatureResource} service={creatureService} />);

  await screen.findByText('妙蛙种子种类');
  await user.click(screen.getByRole('button', { name: '编辑' }));

  expect(await screen.findByText('编辑精灵资料')).toBeInTheDocument();
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
}, 15_000);

it('confirms deletion before removing records', async () => {
  const user = userEvent.setup();
  renderWithQuery(<TestGameDataPage config={creatureResource} service={creatureService} />);

  await screen.findByText('妙蛙种子');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('删除资料')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creatureService.remove).toHaveBeenCalledWith(1));
}, 15_000);

it('uses reference labels in delete titles for relation records without name', async () => {
  const user = userEvent.setup();
  renderWithQuery(<TestGameDataPage config={creatureStatResource} service={creatureStatService} />);

  await screen.findByText('妙蛙种子');
  await screen.findByText('速度');
  await user.click(screen.getByRole('button', { name: '删除' }));

  expect(await screen.findByText('确认删除「妙蛙种子 / 速度 / 45」？')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() => expect(creatureStatService.remove).toHaveBeenCalledWith(10));
}, 15_000);

it('falls back to reference code when a referenced record has no Chinese label', async () => {
  vi.mocked(statService.get).mockResolvedValueOnce({
    id: 2,
    code: 'speed',
  });

  renderWithQuery(<TestGameDataPage config={creatureStatResource} service={creatureStatService} />);

  await screen.findByText('妙蛙种子');
  expect(await screen.findByText('speed')).toBeInTheDocument();
}, 15_000);
