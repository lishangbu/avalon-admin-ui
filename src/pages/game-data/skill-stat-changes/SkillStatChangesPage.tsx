import { GameDataTableView } from '../GameDataTableView';
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
  return <GameDataTableView config={skillStatChangesResource} />;
}
