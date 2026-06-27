import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemAttributeBindingsResource: GameDataResourceConfig = {
  key: 'item-attribute-bindings',
  path: '/game-data/item-attribute-bindings',
  title: '道具属性绑定',
  description: '维护道具属性绑定。',
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
      name: 'attribute_id',
      label: '属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-attributes',
      },
      filter: true,
    },
  ],
};

export function ItemAttributeBindingsPage() {
  return <GameDataTableView config={itemAttributeBindingsResource} />;
}
