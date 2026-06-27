import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemDetailsResource: GameDataResourceConfig = {
  key: 'item-details',
  path: '/game-data/item-details',
  title: '道具详情',
  description: '维护道具详情。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
    {
      name: 'fling_effect_id',
      label: '投掷效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'item-fling-effects',
      },
      filter: true,
    },
    {
      name: 'effect',
      label: '效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'short_effect',
      label: '短效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function ItemDetailsPage() {
  return <GameDataTableView config={itemDetailsResource} />;
}
