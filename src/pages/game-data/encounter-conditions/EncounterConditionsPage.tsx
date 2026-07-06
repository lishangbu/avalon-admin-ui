import { GameDataCrudTable } from '../GameDataCrudTable';
import { encounterConditionsGameDataService } from '../../../services/game-data/encounter-conditions';
import type { GameDataResourceConfig } from '../game-data-resources';

export const encounterConditionsResource: GameDataResourceConfig = {
  key: 'encounter-conditions',
  path: '/game-data/encounter-conditions',
  title: '遭遇条件',
  description: '维护遭遇条件。',
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

export function EncounterConditionsPage() {
  return (
    <GameDataCrudTable
      config={encounterConditionsResource}
      service={encounterConditionsGameDataService}
    />
  );
}
