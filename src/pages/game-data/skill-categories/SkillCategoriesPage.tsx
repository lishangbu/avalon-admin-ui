import { GameDataCrudTable } from '../GameDataCrudTable';
import { skillCategoriesGameDataService } from '../../../services/game-data/skill-categories';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillCategoriesResource: GameDataResourceConfig = {
  key: 'skill-categories',
  path: '/game-data/skill-categories',
  title: '技能元分类',
  description: '维护技能元分类。',
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

export function SkillCategoriesPage() {
  return (
    <GameDataCrudTable config={skillCategoriesResource} service={skillCategoriesGameDataService} />
  );
}
