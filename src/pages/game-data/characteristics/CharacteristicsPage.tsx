import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const characteristicsResource: GameDataResourceConfig = {
  key: 'characteristics',
  path: '/game-data/characteristics',
  title: '个体特征',
  description: '维护个体特征。',
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
      name: 'highest_stat_id',
      label: '最高数值项',
      type: 'long',
      width: 120,
      reference: {
        resource: 'stats',
      },
      filter: true,
    },
    {
      name: 'gene_modulo',
      label: '模数',
      type: 'int',
      required: true,
      width: 120,
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

export function CharacteristicsPage() {
  return <GameDataTableView config={characteristicsResource} />;
}
