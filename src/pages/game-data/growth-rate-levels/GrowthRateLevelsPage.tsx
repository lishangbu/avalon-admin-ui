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
import { growthRateLevelsGameDataService } from '../../../services/game-data/growth-rate-levels';
import type { GameDataResourceConfig } from '../game-data-resources';

export const growthRateLevelsResource: GameDataResourceConfig = {
  key: 'growth-rate-levels',
  path: '/game-data/growth-rate-levels',
  title: '成长等级经验',
  description: '维护成长等级经验。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'growth_rate_id',
      label: '成长速率',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'growth-rates',
      },
      filter: true,
    },
    {
      name: 'level',
      label: '等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'experience',
      label: '经验',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function GrowthRateLevelsPage() {
  const crud = useGameDataCrudPage({
    config: growthRateLevelsResource,
    service: growthRateLevelsGameDataService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <GrowthRateLevelsRecordTable {...crud.recordTableProps} />
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
function GrowthRateLevelsRecordTable({
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
    ...growthRateLevelsResource.fields.map((field, index) => ({
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
            description={`确认删除${formatRecordTitle(growthRateLevelsResource, record, referenceLookup)}？`}
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
        scroll={{ x: tableScrollWidth(growthRateLevelsResource) }}
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
