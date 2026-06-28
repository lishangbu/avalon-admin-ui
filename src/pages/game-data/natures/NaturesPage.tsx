import { GameDataTableView } from '../GameDataTableView';
import { naturesGameDataService } from '../../../services/game-data/natures';
import type { GameDataResourceConfig } from '../game-data-resources';

export const naturesResource: GameDataResourceConfig = {
  key: 'natures',
  path: '/game-data/natures',
  title: '性格资料',
  description: '维护性格资料。',
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
      maxLength: 300,
      width: 180,
    },
    {
      name: 'increased_stat_id',
      label: '提升数值项',
      type: 'long',
      width: 120,
      reference: {
        resource: 'stats',
      },
    },
    {
      name: 'decreased_stat_id',
      label: '降低数值项',
      type: 'long',
      width: 120,
      reference: {
        resource: 'stats',
      },
    },
    {
      name: 'likes_flavor_id',
      label: '偏好口味',
      type: 'long',
      width: 120,
      reference: {
        resource: 'berry-flavors',
      },
    },
    {
      name: 'hates_flavor_id',
      label: '厌恶口味',
      type: 'long',
      width: 120,
      reference: {
        resource: 'berry-flavors',
      },
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

export function NaturesPage() {
  return <GameDataTableView config={naturesResource} service={naturesGameDataService} />;
}
