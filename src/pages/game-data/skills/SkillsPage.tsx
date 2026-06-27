import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillsResource: GameDataResourceConfig = {
  key: 'skills',
  path: '/game-data/skills',
  title: '技能资料',
  description: '维护技能的属性、分类、威力、命中和使用次数。',
  searchPlaceholder: '编码或名称',
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
      name: 'element_id',
      label: '属性',
      type: 'long',
      width: 110,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'damage_class_id',
      label: '分类',
      type: 'long',
      width: 110,
      reference: {
        resource: 'skill-damage-classes',
      },
    },
    {
      name: 'accuracy',
      label: '命中',
      type: 'int',
      width: 90,
    },
    {
      name: 'power',
      label: '威力',
      type: 'int',
      width: 90,
    },
    {
      name: 'pp',
      label: 'PP',
      type: 'int',
      width: 90,
    },
    {
      name: 'priority',
      label: '优先级',
      type: 'int',
      defaultValue: 0,
      width: 100,
    },
    {
      name: 'effect_chance',
      label: '效果概率',
      type: 'int',
      width: 120,
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

export function SkillsPage() {
  return <GameDataTableView config={skillsResource} />;
}
