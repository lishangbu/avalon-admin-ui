import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { creatureHeldItemsGameDataService } from '../../../services/game-data/creature-held-items';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureHeldItemsResource: GameDataResourceConfig = {
  key: 'creature-held-items',
  path: '/game-data/creature-held-items',
  title: '精灵持有道具',
  description: '维护精灵持有道具。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
      },
      filter: true,
    },
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
      name: 'rarity',
      label: '稀有度',
      type: 'int',
      width: 120,
    },
  ],
};

export function CreatureHeldItemsPage() {
  const crud = useGameDataCrudPage({
    config: creatureHeldItemsResource,
    service: creatureHeldItemsGameDataService,
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
