import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const berryFlavorsResource: GameDataResourceConfig = {
  key: 'berry-flavors',
  path: '/game-data/berry-flavors',
  title: '树果口味',
  description: '维护树果口味。',
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
      name: 'contest_type_id',
      label: '评分类别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-types',
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

export function BerryFlavorsPage() {
  return <GameDataTableView config={berryFlavorsResource} />;
}
