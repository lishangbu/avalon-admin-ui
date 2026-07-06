import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { statNatureEffectsGameDataService } from '../../../services/game-data/stat-nature-effects';
import type { GameDataResourceConfig } from '../game-data-resources';

export const statNatureEffectsResource: GameDataResourceConfig = {
  key: 'stat-nature-effects',
  path: '/game-data/stat-nature-effects',
  title: '数值项性格影响',
  description: '维护数值项性格影响。',
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

export function StatNatureEffectsPage() {
  const crud = useGameDataCrudPage({
    config: statNatureEffectsResource,
    service: statNatureEffectsGameDataService,
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
