import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionChainsResource: GameDataResourceConfig = {
  key: 'evolution-chains',
  path: '/game-data/evolution-chains',
  title: '进化链',
  description: '维护进化链。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'baby_trigger_item_id',
      label: '幼体触发道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
  ],
};

export function EvolutionChainsPage() {
  return <GameDataTableView config={evolutionChainsResource} />;
}
