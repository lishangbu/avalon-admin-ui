import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const contestEffectsResource: GameDataResourceConfig = {
  key: 'contest-effects',
  path: '/game-data/contest-effects',
  title: '评价效果',
  description: '维护评价效果。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'appeal',
      label: '吸引力',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'jam',
      label: '干扰值',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'effect',
      label: '效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function ContestEffectsPage() {
  return <GameDataTableView config={contestEffectsResource} />;
}
