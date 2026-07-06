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
import { skillDetailsGameDataService } from '../../../services/game-data/skill-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillDetailsResource: GameDataResourceConfig = {
  key: 'skill-details',
  path: '/game-data/skill-details',
  title: '技能详情',
  description: '维护技能详情。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'skill_id',
      label: '技能',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'skills',
      },
    },
    {
      name: 'ailment_id',
      label: '异常',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-ailments',
      },
    },
    {
      name: 'category_id',
      label: '分类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-categories',
      },
    },
    {
      name: 'target_id',
      label: '目标',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-targets',
      },
    },
    {
      name: 'contest_type_id',
      label: '评分类别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-types',
      },
    },
    {
      name: 'contest_effect_id',
      label: '评价效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-effects',
      },
    },
    {
      name: 'advanced_contest_effect_id',
      label: '高级评价效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'advanced-contest-effects',
      },
    },
    {
      name: 'min_hits',
      label: '最少命中',
      type: 'int',
      width: 120,
    },
    {
      name: 'max_hits',
      label: '最多命中',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_turns',
      label: '最少回合',
      type: 'int',
      width: 120,
    },
    {
      name: 'max_turns',
      label: '最多回合',
      type: 'int',
      width: 120,
    },
    {
      name: 'drain',
      label: '吸取值',
      type: 'int',
      width: 120,
    },
    {
      name: 'healing',
      label: '回复值',
      type: 'int',
      width: 120,
    },
    {
      name: 'crit_rate',
      label: '暴击修正',
      type: 'int',
      width: 120,
    },
    {
      name: 'ailment_chance',
      label: '异常概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'flinch_chance',
      label: '畏缩概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'stat_chance',
      label: '数值变化概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'effect',
      label: '效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'short_effect',
      label: '短效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function SkillDetailsPage() {
  const crud = useGameDataCrudPage({
    config: skillDetailsResource,
    service: skillDetailsGameDataService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <SkillDetailsRecordTable {...crud.recordTableProps} />
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
function SkillDetailsRecordTable({
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
    ...skillDetailsResource.fields.map((field, index) => ({
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
            description={`确认删除${formatRecordTitle(skillDetailsResource, record, referenceLookup)}？`}
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
        scroll={{ x: tableScrollWidth(skillDetailsResource) }}
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
