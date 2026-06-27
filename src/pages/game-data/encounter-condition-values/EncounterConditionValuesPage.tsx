import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const encounterConditionValuesResource: GameDataResourceConfig = {
  key: 'encounter-condition-values',
  path: '/game-data/encounter-condition-values',
  title: '遭遇条件值',
  description: '维护遭遇条件值。',
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
      name: 'condition_id',
      label: '遭遇条件',
      type: 'long',
      width: 120,
      reference: {
        resource: 'encounter-conditions',
      },
      filter: true,
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

export function EncounterConditionValuesPage() {
  return <GameDataTableView config={encounterConditionValuesResource} />;
}
