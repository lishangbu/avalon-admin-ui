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
import { creatureFormsGameDataService } from '../../../services/game-data/creature-forms';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureFormsResource: GameDataResourceConfig = {
  key: 'creature-forms',
  path: '/game-data/creature-forms',
  title: '精灵形态',
  description: '维护精灵形态。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 190,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      width: 120,
      reference: {
        resource: 'creatures',
      },
    },
    {
      name: 'form_name',
      label: '形态名',
      type: 'string',
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      width: 120,
    },
    {
      name: 'form_order',
      label: '形态排序',
      type: 'int',
      width: 120,
    },
    {
      name: 'battle_only',
      label: '仅战斗',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'default_form',
      label: '默认形态',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'enhanced_form',
      label: '强化形态',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function CreatureFormsPage() {
  const crud = useGameDataCrudPage({
    config: creatureFormsResource,
    service: creatureFormsGameDataService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <CreatureFormsRecordTable {...crud.recordTableProps} />
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
function CreatureFormsRecordTable({
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
    ...creatureFormsResource.fields.map((field, index) => ({
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
            description={`确认删除${formatRecordTitle(creatureFormsResource, record, referenceLookup)}？`}
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
        scroll={{ x: tableScrollWidth(creatureFormsResource) }}
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
