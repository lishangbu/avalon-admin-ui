import { GameDataTableView } from '../GameDataTableView';
import { characteristicValuesGameDataService } from '../../../services/game-data/characteristic-values';
import type { GameDataResourceConfig } from '../game-data-resources';

export const characteristicValuesResource: GameDataResourceConfig = {
  key: 'characteristic-values',
  path: '/game-data/characteristic-values',
  title: '个体特征取值',
  description: '维护个体特征取值。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'characteristic_id',
      label: '特征',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'characteristics',
      },
      filter: true,
    },
    {
      name: 'possible_value',
      label: '可能取值',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function CharacteristicValuesPage() {
  return (
    <GameDataTableView
      config={characteristicValuesResource}
      service={characteristicValuesGameDataService}
    />
  );
}
