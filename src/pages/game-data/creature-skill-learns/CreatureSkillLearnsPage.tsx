import { GameDataTableView } from '../GameDataTableView';
import { creatureSkillLearnsGameDataService } from '../../../services/game-data/creature-skill-learns';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureSkillLearnsResource: GameDataResourceConfig = {
  key: 'creature-skill-learns',
  path: '/game-data/creature-skill-learns',
  title: '精灵技能学习',
  description: '维护精灵技能学习。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
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
      name: 'learn_method_id',
      label: '学习方式',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'skill-learn-methods',
      },
      filter: true,
    },
    {
      name: 'level_learned_at',
      label: '习得等级',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function CreatureSkillLearnsPage() {
  return (
    <GameDataTableView
      config={creatureSkillLearnsResource}
      service={creatureSkillLearnsGameDataService}
    />
  );
}
