import { GameDataTableView } from '../GameDataTableView';
import { elementGameIndicesGameDataService } from '../../../services/game-data/element-game-indices';
import type { GameDataResourceConfig } from '../game-data-resources';

export const elementGameIndicesResource: GameDataResourceConfig = {
  key: 'element-game-indices',
  path: '/game-data/element-game-indices',
  title: '属性索引',
  description: '维护属性索引。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'element_id',
      label: '属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'elements',
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

export function ElementGameIndicesPage() {
  return (
    <GameDataTableView
      config={elementGameIndicesResource}
      service={elementGameIndicesGameDataService}
    />
  );
}
