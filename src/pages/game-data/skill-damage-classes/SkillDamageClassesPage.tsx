import { GameDataTableView } from '../GameDataTableView';
import { skillDamageClassesGameDataService } from '../../../services/game-data/skill-damage-classes';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillDamageClassesResource: GameDataResourceConfig = {
  key: 'skill-damage-classes',
  path: '/game-data/skill-damage-classes',
  title: '技能分类',
  description: '维护技能结算分类和说明。',
  searchPlaceholder: '编码、名称或说明',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
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
      width: 260,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 100,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function SkillDamageClassesPage() {
  return (
    <GameDataTableView
      config={skillDamageClassesResource}
      service={skillDamageClassesGameDataService}
    />
  );
}
