import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const berryFirmnessesResource: GameDataResourceConfig = {
  key: 'berry-firmnesses',
  path: '/game-data/berry-firmnesses',
  title: '树果硬度',
  description: '维护树果硬度。',
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

export function BerryFirmnessesPage() {
  return <GameDataTableView config={berryFirmnessesResource} />;
}
