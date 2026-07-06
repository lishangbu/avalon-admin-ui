import { GameDataCrudTable } from '../GameDataCrudTable';
import { eggGroupsGameDataService } from '../../../services/game-data/egg-groups';
import type { GameDataResourceConfig } from '../game-data-resources';

export const eggGroupsResource: GameDataResourceConfig = {
  key: 'egg-groups',
  path: '/game-data/egg-groups',
  title: '种类分组',
  description: '维护繁育或生态分组字典。',
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
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function EggGroupsPage() {
  return <GameDataCrudTable config={eggGroupsResource} service={eggGroupsGameDataService} />;
}
