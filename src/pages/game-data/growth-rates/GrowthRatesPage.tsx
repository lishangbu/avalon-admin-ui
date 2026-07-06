import { GameDataCrudTable } from '../GameDataCrudTable';
import { growthRatesGameDataService } from '../../../services/game-data/growth-rates';
import type { GameDataResourceConfig } from '../game-data-resources';

export const growthRatesResource: GameDataResourceConfig = {
  key: 'growth-rates',
  path: '/game-data/growth-rates',
  title: '成长速率',
  description: '维护成长速率。',
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
      name: 'formula',
      label: '公式',
      type: 'string',
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

export function GrowthRatesPage() {
  return <GameDataCrudTable config={growthRatesResource} service={growthRatesGameDataService} />;
}
