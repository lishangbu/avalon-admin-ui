import { GameDataTableView } from '../GameDataTableView';
import { encounterMethodsGameDataService } from '../../../services/game-data/encounter-methods';
import type { GameDataResourceConfig } from '../game-data-resources';

export const encounterMethodsResource: GameDataResourceConfig = {
  key: 'encounter-methods',
  path: '/game-data/encounter-methods',
  title: '遭遇方式',
  description: '维护遭遇方式。',
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

export function EncounterMethodsPage() {
  return (
    <GameDataTableView
      config={encounterMethodsResource}
      service={encounterMethodsGameDataService}
    />
  );
}
