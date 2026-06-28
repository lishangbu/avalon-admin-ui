import { GameDataTableView } from '../GameDataTableView';
import { speciesShapesGameDataService } from '../../../services/game-data/species-shapes';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesShapesResource: GameDataResourceConfig = {
  key: 'species-shapes',
  path: '/game-data/species-shapes',
  title: '种类形态',
  description: '维护种类外形轮廓字典。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 100,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function SpeciesShapesPage() {
  return (
    <GameDataTableView config={speciesShapesResource} service={speciesShapesGameDataService} />
  );
}
