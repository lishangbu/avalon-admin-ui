import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { evolutionChainsGameDataService } from '../../../services/game-data/evolution-chains';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionChainsResource: GameDataResourceConfig = {
  key: 'evolution-chains',
  path: '/game-data/evolution-chains',
  title: '进化链',
  description: '维护进化链。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'baby_trigger_item_id',
      label: '幼体触发道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
  ],
};

export function EvolutionChainsPage() {
  const crud = useGameDataCrudPage({
    config: evolutionChainsResource,
    service: evolutionChainsGameDataService,
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
