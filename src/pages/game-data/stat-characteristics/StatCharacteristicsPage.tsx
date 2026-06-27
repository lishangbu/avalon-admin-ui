import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const statCharacteristicsResource: GameDataResourceConfig = {
  key: 'stat-characteristics',
  path: '/game-data/stat-characteristics',
  title: '数值项特征',
  description: '维护数值项特征。',
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
      name: 'characteristic_id',
      label: '特征',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'characteristics',
      },
      filter: true,
    },
  ],
};

export function StatCharacteristicsPage() {
  return <GameDataTableView config={statCharacteristicsResource} />;
}
