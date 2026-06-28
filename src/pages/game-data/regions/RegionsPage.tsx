import { GameDataTableView } from '../GameDataTableView';
import { regionsGameDataService } from '../../../services/game-data/regions';
import type { GameDataResourceConfig } from '../game-data-resources';

export const regionsResource: GameDataResourceConfig = {
  key: 'regions',
  path: '/game-data/regions',
  title: '地区资料',
  description: '维护地区资料。',
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
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function RegionsPage() {
  return <GameDataTableView config={regionsResource} service={regionsGameDataService} />;
}
