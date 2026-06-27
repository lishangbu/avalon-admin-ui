import { GameDataTableView } from '../GameDataTableView';
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
  return <GameDataTableView config={skillContestCombosResource} />;
}
