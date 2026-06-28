import { GameDataTableView } from '../GameDataTableView';
import { speciesGameDataService } from '../../../services/game-data/species';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesResource: GameDataResourceConfig = {
  key: 'species',
  path: '/game-data/species',
  title: '种类资料',
  description: '维护种类层面的颜色、形态、栖息地和基础参数。',
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
      name: 'color_id',
      label: '颜色',
      type: 'long',
      width: 110,
      reference: {
        resource: 'species-colors',
      },
    },
    {
      name: 'shape_id',
      label: '形态',
      type: 'long',
      width: 110,
      reference: {
        resource: 'species-shapes',
      },
    },
    {
      name: 'habitat_id',
      label: '栖息地',
      type: 'long',
      width: 120,
      reference: {
        resource: 'habitats',
      },
    },
    {
      name: 'gender_rate',
      label: '性别比例',
      type: 'int',
      width: 120,
    },
    {
      name: 'capture_rate',
      label: '捕获率',
      type: 'int',
      width: 110,
    },
    {
      name: 'base_happiness',
      label: '初始亲和度',
      type: 'int',
      width: 130,
    },
    {
      name: 'hatch_counter',
      label: '孵化计数',
      type: 'int',
      width: 120,
    },
    {
      name: 'baby',
      label: '幼体',
      type: 'boolean',
      defaultValue: false,
      width: 90,
    },
    {
      name: 'legendary',
      label: '传说级',
      type: 'boolean',
      defaultValue: false,
      width: 100,
    },
    {
      name: 'mythical',
      label: '幻级',
      type: 'boolean',
      defaultValue: false,
      width: 90,
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

export function SpeciesPage() {
  return <GameDataTableView config={speciesResource} service={speciesGameDataService} />;
}
