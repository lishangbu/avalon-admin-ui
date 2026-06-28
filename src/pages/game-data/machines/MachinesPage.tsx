import { GameDataTableView } from '../GameDataTableView';
import { machinesGameDataService } from '../../../services/game-data/machines';
import type { GameDataResourceConfig } from '../game-data-resources';

export const machinesResource: GameDataResourceConfig = {
  key: 'machines',
  path: '/game-data/machines',
  title: '机器资料',
  description: '维护机器资料。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
    {
      name: 'skill_id',
      label: '技能',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'skills',
      },
      filter: true,
    },
  ],
};

export function MachinesPage() {
  return <GameDataTableView config={machinesResource} service={machinesGameDataService} />;
}
