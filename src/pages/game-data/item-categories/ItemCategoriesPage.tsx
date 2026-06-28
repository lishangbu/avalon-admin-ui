import { GameDataTableView } from '../GameDataTableView';
import { itemCategoriesGameDataService } from '../../../services/game-data/item-categories';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemCategoriesResource: GameDataResourceConfig = {
  key: 'item-categories',
  path: '/game-data/item-categories',
  title: '道具分类',
  description: '维护道具分类字典。',
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

export function ItemCategoriesPage() {
  return (
    <GameDataTableView config={itemCategoriesResource} service={itemCategoriesGameDataService} />
  );
}
