import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { growthRateLevelsGameDataService } from '../../../services/game-data/growth-rate-levels';
import type { GameDataResourceConfig } from '../game-data-resources';

export const growthRateLevelsResource: GameDataResourceConfig = {
  key: 'growth-rate-levels',
  path: '/game-data/growth-rate-levels',
  title: '成长等级经验',
  description: '维护成长等级经验。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'growth_rate_id',
      label: '成长速率',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'growth-rates',
      },
      filter: true,
    },
    {
      name: 'level',
      label: '等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'experience',
      label: '经验',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function GrowthRateLevelsPage() {
  const crud = useGameDataCrudPage({
    config: growthRateLevelsResource,
    service: growthRateLevelsGameDataService,
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
