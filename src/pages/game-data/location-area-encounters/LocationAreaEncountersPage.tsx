import { GameDataTableView } from '../GameDataTableView';
import { locationAreaEncountersGameDataService } from '../../../services/game-data/location-area-encounters';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationAreaEncountersResource: GameDataResourceConfig = {
  key: 'location-area-encounters',
  path: '/game-data/location-area-encounters',
  title: '区域精灵遭遇',
  description: '维护区域精灵遭遇。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'area_id',
      label: '区域',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'location-areas',
      },
      filter: true,
    },
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
      name: 'method_id',
      label: '遭遇方式',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'encounter-methods',
      },
      filter: true,
    },
    {
      name: 'min_level',
      label: '最低等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'max_level',
      label: '最高等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'chance',
      label: '概率',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'max_chance',
      label: '最大概率',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function LocationAreaEncountersPage() {
  return (
    <GameDataTableView
      config={locationAreaEncountersResource}
      service={locationAreaEncountersGameDataService}
    />
  );
}
