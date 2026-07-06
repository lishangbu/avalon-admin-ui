import { GameDataCrudTable } from '../GameDataCrudTable';
import { locationAreaEncounterConditionValuesGameDataService } from '../../../services/game-data/location-area-encounter-condition-values';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationAreaEncounterConditionValuesResource: GameDataResourceConfig = {
  key: 'location-area-encounter-condition-values',
  path: '/game-data/location-area-encounter-condition-values',
  title: '区域遭遇条件绑定',
  description: '维护区域遭遇条件绑定。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'encounter_id',
      label: '遭遇',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'location-area-encounters',
      },
      filter: true,
    },
    {
      name: 'condition_value_id',
      label: '遭遇条件值',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'encounter-condition-values',
      },
      filter: true,
    },
  ],
};

export function LocationAreaEncounterConditionValuesPage() {
  return (
    <GameDataCrudTable
      config={locationAreaEncounterConditionValuesResource}
      service={locationAreaEncounterConditionValuesGameDataService}
    />
  );
}
