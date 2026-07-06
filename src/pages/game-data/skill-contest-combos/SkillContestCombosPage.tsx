import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { skillContestCombosGameDataService } from '../../../services/game-data/skill-contest-combos';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillContestCombosResource: GameDataResourceConfig = {
  key: 'skill-contest-combos',
  path: '/game-data/skill-contest-combos',
  title: '技能评价组合',
  description: '维护技能评价组合。',
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
      name: 'combo_type',
      label: '组合类型',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'relation_type',
      label: '关系类型',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'related_skill_id',
      label: '关联技能',
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

export function SkillContestCombosPage() {
  const crud = useGameDataCrudPage({
    config: skillContestCombosResource,
    service: skillContestCombosGameDataService,
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
