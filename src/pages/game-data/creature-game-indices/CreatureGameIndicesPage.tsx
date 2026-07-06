import { GameDataCrudTable } from '../GameDataCrudTable';
import { creatureGameIndicesGameDataService } from '../../../services/game-data/creature-game-indices';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureGameIndicesResource: GameDataResourceConfig = {
  key: 'creature-game-indices',
  path: '/game-data/creature-game-indices',
  title: '精灵索引',
  description: '维护精灵索引。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
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

export function CreatureGameIndicesPage() {
  return (
    <GameDataCrudTable
      config={creatureGameIndicesResource}
      service={creatureGameIndicesGameDataService}
    />
  );
}
