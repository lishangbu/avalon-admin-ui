import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { skillStatChangesGameDataService } from '../../../services/game-data/skill-stat-changes';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillStatChangesResource: GameDataResourceConfig = {
  key: 'skill-stat-changes',
  path: '/game-data/skill-stat-changes',
  title: '技能数值变化',
  description: '维护技能数值变化。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'change_value',
      label: '变化值',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function SkillStatChangesPage() {
  const crud = useGameDataCrudPage({
    config: skillStatChangesResource,
    service: skillStatChangesGameDataService,
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
