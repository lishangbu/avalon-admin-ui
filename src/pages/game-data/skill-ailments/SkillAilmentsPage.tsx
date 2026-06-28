import { GameDataTableView } from '../GameDataTableView';
import { skillAilmentsGameDataService } from '../../../services/game-data/skill-ailments';
import type { GameDataResourceConfig } from '../game-data-resources';

export const skillAilmentsResource: GameDataResourceConfig = {
  key: 'skill-ailments',
  path: '/game-data/skill-ailments',
  title: '技能异常',
  description: '维护技能异常。',
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
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function SkillAilmentsPage() {
  return (
    <GameDataTableView config={skillAilmentsResource} service={skillAilmentsGameDataService} />
  );
}
