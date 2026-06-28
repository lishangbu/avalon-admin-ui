import { GameDataTableView } from '../GameDataTableView';
import { itemAttributesGameDataService } from '../../../services/game-data/item-attributes';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemAttributesResource: GameDataResourceConfig = {
  key: 'item-attributes',
  path: '/game-data/item-attributes',
  title: '道具属性',
  description: '维护道具属性。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 190,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'description',
      label: '说明',
      type: 'string',
      width: 280,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function ItemAttributesPage() {
  return (
    <GameDataTableView config={itemAttributesResource} service={itemAttributesGameDataService} />
  );
}
