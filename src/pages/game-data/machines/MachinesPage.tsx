import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
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
  const crud = useGameDataCrudPage({ config: machinesResource, service: machinesGameDataService });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <GameDataRecordTable {...crud.recordTableProps} />
      <EntityDrawer {...crud.detailDrawerProps} />
      <GameDataEditModal {...crud.editModalProps} />
    </div>
  );
}
