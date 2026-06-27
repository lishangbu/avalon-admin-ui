import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const advancedContestEffectSkillsResource: GameDataResourceConfig = {
  key: 'advanced-contest-effect-skills',
  path: '/game-data/advanced-contest-effect-skills',
  title: '高级评价效果技能',
  description: '维护高级评价效果技能。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'advanced_contest_effect_id',
      label: '高级评价效果',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'advanced-contest-effects',
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
  ],
};

export function AdvancedContestEffectSkillsPage() {
  return <GameDataTableView config={advancedContestEffectSkillsResource} />;
}
