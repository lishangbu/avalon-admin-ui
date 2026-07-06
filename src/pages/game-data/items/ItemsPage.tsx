import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { itemsGameDataService } from '../../../services/game-data/items';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemsResource: GameDataResourceConfig = {
  key: 'items',
  path: '/game-data/items',
  title: '道具资料',
  description: '维护道具名称、分类、价格和投掷威力。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'category_id',
      label: '分类',
      type: 'long',
      width: 110,
      reference: {
        resource: 'item-categories',
      },
      filter: true,
    },
    {
      name: 'cost',
      label: '价格',
      type: 'int',
      defaultValue: 0,
      width: 100,
    },
    {
      name: 'fling_power',
      label: '投掷威力',
      type: 'int',
      width: 120,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function ItemsPage() {
  const crud = useGameDataCrudPage({ config: itemsResource, service: itemsGameDataService });

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
