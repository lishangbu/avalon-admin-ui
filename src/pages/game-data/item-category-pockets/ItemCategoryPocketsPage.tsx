import { GameDataTableView } from '../GameDataTableView';
import { itemCategoryPocketsGameDataService } from '../../../services/game-data/item-category-pockets';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemCategoryPocketsResource: GameDataResourceConfig = {
  key: 'item-category-pockets',
  path: '/game-data/item-category-pockets',
  title: '道具分类口袋',
  description: '维护道具分类口袋。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'category_id',
      label: '分类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-categories',
      },
      filter: true,
    },
    {
      name: 'pocket_id',
      label: '口袋',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-pockets',
      },
      filter: true,
    },
  ],
};

export function ItemCategoryPocketsPage() {
  return (
    <GameDataTableView
      config={itemCategoryPocketsResource}
      service={itemCategoryPocketsGameDataService}
    />
  );
}
