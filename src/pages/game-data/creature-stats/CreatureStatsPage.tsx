import { GameDataTableView } from '../GameDataTableView';
import { creatureStatsGameDataService } from '../../../services/game-data/creature-stats';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureStatsResource: GameDataResourceConfig = {
  key: 'creature-stats',
  path: '/game-data/creature-stats',
  title: '精灵数值绑定',
  description: '维护精灵基础数值和努力收益。',
  searchPlaceholder: '精灵或数值项',
  fields: [
    {
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
      },
      filter: true,
    },
    {
      name: 'stat_id',
      label: '数值项',
      type: 'long',
      required: true,
      width: 130,
      reference: {
        resource: 'stats',
      },
      filter: true,
    },
    {
      name: 'base_value',
      label: '基础值',
      type: 'int',
      required: true,
      width: 110,
    },
    {
      name: 'effort',
      label: '努力收益',
      type: 'int',
      defaultValue: 0,
      width: 120,
    },
  ],
};

export function CreatureStatsPage() {
  return (
    <GameDataTableView config={creatureStatsResource} service={creatureStatsGameDataService} />
  );
}
