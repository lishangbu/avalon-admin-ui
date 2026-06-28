import { GameDataTableView } from '../GameDataTableView';
import { eventStatsGameDataService } from '../../../services/game-data/event-stats';
import type { GameDataResourceConfig } from '../game-data-resources';

export const eventStatsResource: GameDataResourceConfig = {
  key: 'event-stats',
  path: '/game-data/event-stats',
  title: '活动能力项',
  description: '维护活动能力项。',
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
      maxLength: 300,
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 120,
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

export function EventStatsPage() {
  return <GameDataTableView config={eventStatsResource} service={eventStatsGameDataService} />;
}
