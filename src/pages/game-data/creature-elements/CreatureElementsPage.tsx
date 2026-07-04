import { GameDataTableView } from '../GameDataTableView';
import { creatureElementsGameDataService } from '../../../services/game-data/creature-elements';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureElementsResource: GameDataResourceConfig = {
  key: 'creature-elements',
  path: '/game-data/creature-elements',
  title: '精灵属性绑定',
  description: '维护精灵条目的属性槽位。',
  searchPlaceholder: '精灵或属性',
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
      name: 'slot_order',
      label: '槽位',
      type: 'int',
      required: true,
      width: 100,
    },
  ],
};

export function CreatureElementsPage() {
  return (
    <GameDataTableView
      config={creatureElementsResource}
      service={creatureElementsGameDataService}
    />
  );
}
