import { GameDataCrudTable } from '../GameDataCrudTable';
import { abilitiesGameDataService } from '../../../services/game-data/abilities';
import type { GameDataResourceConfig } from '../game-data-resources';

export const abilitiesResource: GameDataResourceConfig = {
  key: 'abilities',
  path: '/game-data/abilities',
  title: '特性资料',
  description: '维护可被精灵引用的被动能力资料。',
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
      name: 'main_series',
      label: '主体资料',
      type: 'boolean',
      defaultValue: true,
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

export function AbilitiesPage() {
  return <GameDataCrudTable config={abilitiesResource} service={abilitiesGameDataService} />;
}
