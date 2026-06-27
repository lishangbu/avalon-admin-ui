import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionTriggersResource: GameDataResourceConfig = {
  key: 'evolution-triggers',
  path: '/game-data/evolution-triggers',
  title: '进化触发器',
  description: '维护进化触发器。',
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

export function EvolutionTriggersPage() {
  return <GameDataTableView config={evolutionTriggersResource} />;
}
