import { GameDataCrudTable } from '../GameDataCrudTable';
import { skillBattleStylesGameDataService } from '../../../services/game-data/skill-battle-styles';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillBattleStylesResource: GameDataResourceConfig = {
  key: 'skill-battle-styles',
  path: '/game-data/skill-battle-styles',
  title: '技能战斗风格',
  description: '维护技能战斗风格。',
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
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 120,
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

export function SkillBattleStylesPage() {
  return (
    <GameDataCrudTable
      config={skillBattleStylesResource}
      service={skillBattleStylesGameDataService}
    />
  );
}
