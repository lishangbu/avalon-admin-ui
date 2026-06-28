import { GameDataTableView } from '../GameDataTableView';
import { locationAreasGameDataService } from '../../../services/game-data/location-areas';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationAreasResource: GameDataResourceConfig = {
  key: 'location-areas',
  path: '/game-data/location-areas',
  title: '地点区域',
  description: '维护地点区域。',
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
      name: 'location_id',
      label: '地点',
      type: 'long',
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

export function LocationAreasPage() {
  return (
    <GameDataTableView config={locationAreasResource} service={locationAreasGameDataService} />
  );
}
