import { GameDataTableView } from '../GameDataTableView';
import { contestTypesGameDataService } from '../../../services/game-data/contest-types';
import type { GameDataResourceConfig } from '../game-data-resources';

export const contestTypesResource: GameDataResourceConfig = {
  key: 'contest-types',
  path: '/game-data/contest-types',
  title: '评分类别',
  description: '维护评分类别。',
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
      name: 'color',
      label: '颜色',
      type: 'string',
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

export function ContestTypesPage() {
  return <GameDataTableView config={contestTypesResource} service={contestTypesGameDataService} />;
}
