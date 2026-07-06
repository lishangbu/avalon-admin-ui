import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { statCharacteristicsGameDataService } from '../../../services/game-data/stat-characteristics';
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
  const crud = useGameDataCrudPage({
    config: statCharacteristicsResource,
    service: statCharacteristicsGameDataService,
  });

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
