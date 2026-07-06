import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { locationGameIndicesGameDataService } from '../../../services/game-data/location-game-indices';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationGameIndicesResource: GameDataResourceConfig = {
  key: 'location-game-indices',
  path: '/game-data/location-game-indices',
  title: '地点索引',
  description: '维护地点索引。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'location_id',
      label: '地点',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'locations',
      },
      filter: true,
    },
    {
      name: 'game_index',
      label: '索引',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function LocationGameIndicesPage() {
  const crud = useGameDataCrudPage({
    config: locationGameIndicesResource,
    service: locationGameIndicesGameDataService,
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
