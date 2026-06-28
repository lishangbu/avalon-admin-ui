import { GameDataTableView } from '../GameDataTableView';
import { itemFlingEffectsGameDataService } from '../../../services/game-data/item-fling-effects';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemFlingEffectsResource: GameDataResourceConfig = {
  key: 'item-fling-effects',
  path: '/game-data/item-fling-effects',
  title: '道具投掷效果',
  description: '维护道具投掷效果。',
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
      name: 'effect',
      label: '效果',
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

export function ItemFlingEffectsPage() {
  return (
    <GameDataTableView
      config={itemFlingEffectsResource}
      service={itemFlingEffectsGameDataService}
    />
  );
}
