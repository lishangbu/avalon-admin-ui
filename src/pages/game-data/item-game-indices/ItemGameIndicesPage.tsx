import { GameDataTableView } from '../GameDataTableView';
import { itemGameIndicesGameDataService } from '../../../services/game-data/item-game-indices';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemGameIndicesResource: GameDataResourceConfig = {
  key: 'item-game-indices',
  path: '/game-data/item-game-indices',
  title: '道具索引',
  description: '维护道具索引。',
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
      name: 'game_index',
      label: '索引',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function ItemGameIndicesPage() {
  return (
    <GameDataTableView config={itemGameIndicesResource} service={itemGameIndicesGameDataService} />
  );
}
