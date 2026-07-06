import { Alert, Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { GameDataRecord } from '../../../services/game-data/shared';
import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import {
  fieldColumnWidth,
  fieldLabel,
  formatRecordTitle,
  queryErrorMessage,
  renderFieldValue,
  tableScrollWidth,
} from '../GameDataCrudFormatters';
import type { GameDataRecordTableProps } from '../GameDataCrudTypes';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { evolutionDetailsGameDataService } from '../../../services/game-data/evolution-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionDetailsResource: GameDataResourceConfig = {
  key: 'evolution-details',
  path: '/game-data/evolution-details',
  title: '进化条件',
  description: '维护进化条件。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'chain_id',
      label: '进化链',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'evolution-chains',
      },
    },
    {
      name: 'from_species_id',
      label: '起始种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'to_species_id',
      label: '目标种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'trigger_id',
      label: '触发器',
      type: 'long',
      width: 120,
      reference: {
        resource: 'evolution-triggers',
      },
      filter: true,
    },
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
    },
    {
      name: 'held_item_id',
      label: '持有道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
    },
    {
      name: 'known_skill_id',
      label: '已掌握技能',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skills',
      },
    },
    {
      name: 'known_element_id',
      label: '已掌握属性',
      type: 'long',
      width: 120,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'location_id',
      label: '地点',
      type: 'long',
      width: 120,
      reference: {
        resource: 'locations',
      },
    },
    {
      name: 'party_species_id',
      label: '队伍种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'party_element_id',
      label: '队伍属性',
      type: 'long',
      width: 120,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'trade_species_id',
      label: '交换种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'gender_id',
      label: '性别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'genders',
      },
    },
    {
      name: 'region_id',
      label: '地区',
      type: 'long',
      width: 120,
      reference: {
        resource: 'regions',
      },
    },
    {
      name: 'min_level',
      label: '最低等级',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_happiness',
      label: '最低亲和度',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_beauty',
      label: '最低美丽度',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_affection',
      label: '最低友好度',
      type: 'int',
      width: 120,
    },
    {
      name: 'relative_physical_stats',
      label: '物攻物防关系',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_damage_taken',
      label: '最低承伤',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_move_count',
      label: '最低技能数',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_steps',
      label: '最低步数',
      type: 'int',
      width: 120,
    },
    {
      name: 'time_of_day',
      label: '时间段',
      type: 'string',
      width: 180,
    },
    {
      name: 'needs_overworld_rain',
      label: '需要下雨',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'turn_upside_down',
      label: '需要倒置',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'near_special_rock',
      label: '靠近特殊岩石',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'needs_multiplayer',
      label: '需要多人',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'is_default',
      label: '默认条件',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
  ],
};

export function EvolutionDetailsPage() {
  const crud = useGameDataCrudPage({
    config: evolutionDetailsResource,
    service: evolutionDetailsGameDataService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <EvolutionDetailsRecordTable {...crud.recordTableProps} />
      <EntityDrawer {...crud.detailDrawerProps} />
      <GameDataEditModal {...crud.editModalProps} />
    </div>
  );
}
/**
 * 当前资料页面自己的表格实现。
 *
 * 表格列、操作列和横向滚动宽度都绑定在当前页面的资源配置上，不再经过一个共享的资料表格组件分发。
 * 这样某个资料页面后续需要独立列顺序、额外按钮、只读操作或特殊分页行为时，可以只修改本页，不会影响其它资料维护页。
 * 字段渲染、引用文本和错误文案仍复用底层格式化函数，保证“引用 ID 展示为中文文本”等跨页面规则继续保持一致。
 */
function EvolutionDetailsRecordTable({
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
}: GameDataRecordTableProps) {
  const columns: ColumnsType<GameDataRecord> = [
    ...evolutionDetailsResource.fields.map((field, index) => ({
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
            description={`确认删除${formatRecordTitle(evolutionDetailsResource, record, referenceLookup)}？`}
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
        scroll={{ x: tableScrollWidth(evolutionDetailsResource) }}
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
