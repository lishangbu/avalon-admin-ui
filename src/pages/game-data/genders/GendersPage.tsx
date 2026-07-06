import { GameDataCrudTable } from '../GameDataCrudTable';
import { gendersGameDataService } from '../../../services/game-data/genders';
import type { GameDataResourceConfig } from '../game-data-resources';

export const gendersResource: GameDataResourceConfig = {
  key: 'genders',
  path: '/game-data/genders',
  title: '性别资料',
  description: '维护性别资料。',
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
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
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

export function GendersPage() {
  return <GameDataCrudTable config={gendersResource} service={gendersGameDataService} />;
}
