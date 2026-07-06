import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { berryFlavorPotenciesGameDataService } from '../../../services/game-data/berry-flavor-potencies';
import type { GameDataResourceConfig } from '../game-data-resources';

export const berryFlavorPotenciesResource: GameDataResourceConfig = {
  key: 'berry-flavor-potencies',
  path: '/game-data/berry-flavor-potencies',
  title: '树果口味强度',
  description: '维护树果口味强度。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'berry_id',
      label: '树果',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'berries',
      },
      filter: true,
    },
    {
      name: 'flavor_id',
      label: '口味',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'berry-flavors',
      },
      filter: true,
    },
    {
      name: 'potency',
      label: '强度',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function BerryFlavorPotenciesPage() {
  const crud = useGameDataCrudPage({
    config: berryFlavorPotenciesResource,
    service: berryFlavorPotenciesGameDataService,
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
