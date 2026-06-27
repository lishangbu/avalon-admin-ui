import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureHeldItemsResource: GameDataResourceConfig = {
  key: 'creature-held-items',
  path: '/game-data/creature-held-items',
  title: '生物持有道具',
  description: '维护生物持有道具。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'creature_id',
      label: '生物',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
      },
      filter: true,
    },
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
      name: 'rarity',
      label: '稀有度',
      type: 'int',
      width: 120,
    },
  ],
};

export function CreatureHeldItemsPage() {
  return <GameDataTableView config={creatureHeldItemsResource} />;
}
