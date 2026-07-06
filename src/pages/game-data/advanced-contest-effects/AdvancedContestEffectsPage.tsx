import { GameDataCrudTable } from '../GameDataCrudTable';
import { advancedContestEffectsGameDataService } from '../../../services/game-data/advanced-contest-effects';
import type { GameDataResourceConfig } from '../game-data-resources';

export const advancedContestEffectsResource: GameDataResourceConfig = {
  key: 'advanced-contest-effects',
  path: '/game-data/advanced-contest-effects',
  title: '高级评价效果',
  description: '维护高级评价效果。',
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
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function AdvancedContestEffectsPage() {
  return (
    <GameDataCrudTable
      config={advancedContestEffectsResource}
      service={advancedContestEffectsGameDataService}
    />
  );
}
