import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const statNatureEffectsResource: GameDataResourceConfig = {
  key: 'stat-nature-effects',
  path: '/game-data/stat-nature-effects',
  title: '数值项性格影响',
  description: '维护数值项性格影响。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'stat_id',
      label: '数值项',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'stats',
      },
      filter: true,
    },
    {
      name: 'nature_id',
      label: '性格',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'natures',
      },
      filter: true,
    },
    {
      name: 'effect_type',
      label: '影响类型',
      type: 'string',
      required: true,
      width: 180,
    },
  ],
};

export function StatNatureEffectsPage() {
  return <GameDataTableView config={statNatureEffectsResource} />;
}
