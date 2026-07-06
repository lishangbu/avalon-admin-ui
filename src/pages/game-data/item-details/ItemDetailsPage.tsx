import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { itemDetailsGameDataService } from '../../../services/game-data/item-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemDetailsResource: GameDataResourceConfig = {
  key: 'item-details',
  path: '/game-data/item-details',
  title: '道具详情',
  description: '维护道具详情。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
    {
      name: 'fling_effect_id',
      label: '投掷效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'item-fling-effects',
      },
      filter: true,
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

export function ItemDetailsPage() {
  const crud = useGameDataCrudPage({
    config: itemDetailsResource,
    service: itemDetailsGameDataService,
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
