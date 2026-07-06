import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { skillDetailsGameDataService } from '../../../services/game-data/skill-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillDetailsResource: GameDataResourceConfig = {
  key: 'skill-details',
  path: '/game-data/skill-details',
  title: '技能详情',
  description: '维护技能详情。',
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
    },
    {
      name: 'ailment_id',
      label: '异常',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-ailments',
      },
    },
    {
      name: 'category_id',
      label: '分类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-categories',
      },
    },
    {
      name: 'target_id',
      label: '目标',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skill-targets',
      },
    },
    {
      name: 'contest_type_id',
      label: '评分类别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-types',
      },
    },
    {
      name: 'contest_effect_id',
      label: '评价效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-effects',
      },
    },
    {
      name: 'advanced_contest_effect_id',
      label: '高级评价效果',
      type: 'long',
      width: 120,
      reference: {
        resource: 'advanced-contest-effects',
      },
    },
    {
      name: 'min_hits',
      label: '最少命中',
      type: 'int',
      width: 120,
    },
    {
      name: 'max_hits',
      label: '最多命中',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_turns',
      label: '最少回合',
      type: 'int',
      width: 120,
    },
    {
      name: 'max_turns',
      label: '最多回合',
      type: 'int',
      width: 120,
    },
    {
      name: 'drain',
      label: '吸取值',
      type: 'int',
      width: 120,
    },
    {
      name: 'healing',
      label: '回复值',
      type: 'int',
      width: 120,
    },
    {
      name: 'crit_rate',
      label: '暴击修正',
      type: 'int',
      width: 120,
    },
    {
      name: 'ailment_chance',
      label: '异常概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'flinch_chance',
      label: '畏缩概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'stat_chance',
      label: '数值变化概率',
      type: 'int',
      width: 120,
    },
    {
      name: 'effect',
      label: '效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'short_effect',
      label: '短效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function SkillDetailsPage() {
  const crud = useGameDataCrudPage({
    config: skillDetailsResource,
    service: skillDetailsGameDataService,
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
