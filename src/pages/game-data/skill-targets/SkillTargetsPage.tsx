import { GameDataTableView } from '../GameDataTableView';
import { skillTargetsGameDataService } from '../../../services/game-data/skill-targets';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillTargetsResource: GameDataResourceConfig = {
  key: 'skill-targets',
  path: '/game-data/skill-targets',
  title: '技能目标',
  description: '维护技能目标。',
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

export function SkillTargetsPage() {
  return <GameDataTableView config={skillTargetsResource} service={skillTargetsGameDataService} />;
}
