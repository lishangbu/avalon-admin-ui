import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { statSkillEffectsGameDataService } from '../../../services/game-data/stat-skill-effects';
import type { GameDataResourceConfig } from '../game-data-resources';

export const statSkillEffectsResource: GameDataResourceConfig = {
  key: 'stat-skill-effects',
  path: '/game-data/stat-skill-effects',
  title: '数值项技能影响',
  description: '维护数值项技能影响。',
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
    {
      name: 'change_value',
      label: '变化值',
      type: 'int',
      required: true,
      width: 120,
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

export function StatSkillEffectsPage() {
  const crud = useGameDataCrudPage({
    config: statSkillEffectsResource,
    service: statSkillEffectsGameDataService,
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
