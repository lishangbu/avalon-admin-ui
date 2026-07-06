import { GameDataCrudTable } from '../GameDataCrudTable';
import { statsGameDataService } from '../../../services/game-data/stats';
import type { GameDataResourceConfig } from '../game-data-resources';

export const statsResource: GameDataResourceConfig = {
  key: 'stats',
  path: '/game-data/stats',
  title: '数值项',
  description: '维护生命、攻击等基础数值项。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 100,
    },
    {
      name: 'battle_only',
      label: '仅运行时',
      type: 'boolean',
      defaultValue: false,
      width: 120,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function StatsPage() {
  return <GameDataCrudTable config={statsResource} service={statsGameDataService} />;
}
