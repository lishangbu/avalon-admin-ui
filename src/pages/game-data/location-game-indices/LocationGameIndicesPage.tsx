import { GameDataCrudTable } from '../GameDataCrudTable';
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
  return (
    <GameDataCrudTable
      config={locationGameIndicesResource}
      service={locationGameIndicesGameDataService}
    />
  );
}
