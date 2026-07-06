import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { eventStatNatureEffectsGameDataService } from '../../../services/game-data/event-stat-nature-effects';
import type { GameDataResourceConfig } from '../game-data-resources';

export const eventStatNatureEffectsResource: GameDataResourceConfig = {
  key: 'event-stat-nature-effects',
  path: '/game-data/event-stat-nature-effects',
  title: '活动能力性格影响',
  description: '维护活动能力性格影响。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'effect_type',
      label: '影响类型',
      type: 'string',
      required: true,
      width: 180,
    },
  ],
};

export function EventStatNatureEffectsPage() {
  const crud = useGameDataCrudPage({
    config: eventStatNatureEffectsResource,
    service: eventStatNatureEffectsGameDataService,
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
