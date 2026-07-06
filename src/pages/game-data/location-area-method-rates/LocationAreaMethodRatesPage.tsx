import { GameDataCrudTable } from '../GameDataCrudTable';
import { locationAreaMethodRatesGameDataService } from '../../../services/game-data/location-area-method-rates';
import type { GameDataResourceConfig } from '../game-data-resources';

export const locationAreaMethodRatesResource: GameDataResourceConfig = {
  key: 'location-area-method-rates',
  path: '/game-data/location-area-method-rates',
  title: '区域遭遇方式概率',
  description: '维护区域遭遇方式概率。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'area_id',
      label: '区域',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'location-areas',
      },
      filter: true,
    },
    {
      name: 'method_id',
      label: '遭遇方式',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'encounter-methods',
      },
      filter: true,
    },
    {
      name: 'rate',
      label: '概率',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function LocationAreaMethodRatesPage() {
  return (
    <GameDataCrudTable
      config={locationAreaMethodRatesResource}
      service={locationAreaMethodRatesGameDataService}
    />
  );
}
