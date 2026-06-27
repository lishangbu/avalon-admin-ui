import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const transferAreaSpeciesResource: GameDataResourceConfig = {
  key: 'transfer-area-species',
  path: '/game-data/transfer-area-species',
  title: '迁移区域种类',
  description: '维护迁移区域种类。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'area_id',
      label: '区域',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'transfer-areas',
      },
      filter: true,
    },
    {
      name: 'species_id',
      label: '种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'base_score',
      label: '基础分',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'rate',
      label: '概率',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function TransferAreaSpeciesPage() {
  return <GameDataTableView config={transferAreaSpeciesResource} />;
}
