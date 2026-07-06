import { GameDataCrudTable } from '../GameDataCrudTable';
import { locationsGameDataService } from '../../../services/game-data/locations';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationsResource: GameDataResourceConfig = {
  key: 'locations',
  path: '/game-data/locations',
  title: '地点资料',
  description: '维护地点资料。',
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
      name: 'region_id',
      label: '地区',
      type: 'long',
      width: 120,
      reference: {
        resource: 'regions',
      },
      filter: true,
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

export function LocationsPage() {
  return <GameDataCrudTable config={locationsResource} service={locationsGameDataService} />;
}
