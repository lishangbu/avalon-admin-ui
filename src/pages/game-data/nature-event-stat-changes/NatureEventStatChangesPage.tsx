import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const natureEventStatChangesResource: GameDataResourceConfig = {
  key: 'nature-event-stat-changes',
  path: '/game-data/nature-event-stat-changes',
  title: '性格活动能力变化',
  description: '维护性格活动能力变化。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'event_stat_id',
      label: '活动能力项',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'event-stats',
      },
      filter: true,
    },
    {
      name: 'max_change',
      label: '最大变化',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function NatureEventStatChangesPage() {
  return <GameDataTableView config={natureEventStatChangesResource} />;
}
