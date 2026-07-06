import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { natureEventStatChangesGameDataService } from '../../../services/game-data/nature-event-stat-changes';
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
  const crud = useGameDataCrudPage({
    config: natureEventStatChangesResource,
    service: natureEventStatChangesGameDataService,
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
