import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { itemCategoryPocketsGameDataService } from '../../../services/game-data/item-category-pockets';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemCategoryPocketsResource: GameDataResourceConfig = {
  key: 'item-category-pockets',
  path: '/game-data/item-category-pockets',
  title: '道具分类口袋',
  description: '维护道具分类口袋。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'category_id',
      label: '分类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-categories',
      },
      filter: true,
    },
    {
      name: 'pocket_id',
      label: '口袋',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-pockets',
      },
      filter: true,
    },
  ],
};

export function ItemCategoryPocketsPage() {
  const crud = useGameDataCrudPage({
    config: itemCategoryPocketsResource,
    service: itemCategoryPocketsGameDataService,
  });

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
