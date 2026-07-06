import { GameDataCrudTable } from '../GameDataCrudTable';
import { skillLearnMethodsGameDataService } from '../../../services/game-data/skill-learn-methods';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillLearnMethodsResource: GameDataResourceConfig = {
  key: 'skill-learn-methods',
  path: '/game-data/skill-learn-methods',
  title: '技能学习方式',
  description: '维护技能学习方式。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 190,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'description',
      label: '说明',
      type: 'string',
      width: 280,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function SkillLearnMethodsPage() {
  return (
    <GameDataCrudTable
      config={skillLearnMethodsResource}
      service={skillLearnMethodsGameDataService}
    />
  );
}
