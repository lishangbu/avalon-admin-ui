import { GameDataTableView } from '../GameDataTableView';
import { creatureAbilitiesGameDataService } from '../../../services/game-data/creature-abilities';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureAbilitiesResource: GameDataResourceConfig = {
  key: 'creature-abilities',
  path: '/game-data/creature-abilities',
  title: '精灵特性绑定',
  description: '维护精灵条目的特性槽位。',
  searchPlaceholder: '精灵或特性',
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
      name: 'ability_id',
      label: '特性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'abilities',
      },
      filter: true,
    },
    {
      name: 'slot_order',
      label: '槽位',
      type: 'int',
      required: true,
      width: 100,
    },
    {
      name: 'hidden',
      label: '隐藏',
      type: 'boolean',
      defaultValue: false,
      width: 100,
    },
  ],
};

export function CreatureAbilitiesPage() {
  return (
    <GameDataTableView
      config={creatureAbilitiesResource}
      service={creatureAbilitiesGameDataService}
    />
  );
}
