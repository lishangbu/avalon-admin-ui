import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const growthRateLevelsResource: GameDataResourceConfig = {
  key: 'growth-rate-levels',
  path: '/game-data/growth-rate-levels',
  title: '成长等级经验',
  description: '维护成长等级经验。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'growth_rate_id',
      label: '成长速率',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'growth-rates',
      },
      filter: true,
    },
    {
      name: 'level',
      label: '等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'experience',
      label: '经验',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function GrowthRateLevelsPage() {
  return <GameDataTableView config={growthRateLevelsResource} />;
}
