import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { berriesGameDataService } from '../../../services/game-data/berries';
import type { GameDataResourceConfig } from '../game-data-resources';

export const berriesResource: GameDataResourceConfig = {
  key: 'berries',
  path: '/game-data/berries',
  title: '树果资料',
  description: '维护树果资料。',
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
      name: 'item_id',
      label: '道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
    },
    {
      name: 'firmness_id',
      label: '硬度',
      type: 'long',
      width: 120,
      reference: {
        resource: 'berry-firmnesses',
      },
    },
    {
      name: 'natural_gift_element_id',
      label: '自然效果属性',
      type: 'long',
      width: 120,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'growth_time',
      label: '成长时间',
      type: 'int',
      width: 120,
    },
    {
      name: 'max_harvest',
      label: '最大收获',
      type: 'int',
      width: 120,
    },
    {
      name: 'natural_gift_power',
      label: '自然效果威力',
      type: 'int',
      width: 120,
    },
    {
      name: 'size',
      label: '尺寸',
      type: 'int',
      width: 120,
    },
    {
      name: 'smoothness',
      label: '顺滑度',
      type: 'int',
      width: 120,
    },
    {
      name: 'soil_dryness',
      label: '土壤干燥度',
      type: 'int',
      width: 120,
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

export function BerriesPage() {
  const crud = useGameDataCrudPage({ config: berriesResource, service: berriesGameDataService });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <GameDataRecordTable {...crud.recordTableProps} />
      <EntityDrawer {...crud.detailDrawerProps} />
      <GameDataEditModal {...crud.editModalProps} />
    </div>
  );
}
