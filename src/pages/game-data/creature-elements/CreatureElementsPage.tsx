import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureElementsResource: GameDataResourceConfig = {
  key: 'creature-elements',
  path: '/game-data/creature-elements',
  title: '生物属性绑定',
  description: '维护生物条目的属性槽位。',
  searchPlaceholder: '生物或属性',
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
  return <GameDataTableView config={creatureElementsResource} />;
}
