import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const genderSpeciesRatesResource: GameDataResourceConfig = {
  key: 'gender-species-rates',
  path: '/game-data/gender-species-rates',
  title: '性别种类比例',
  description: '维护性别种类比例。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'gender_id',
      label: '性别',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'genders',
      },
      filter: true,
    },
    {
      name: 'species_id',
      label: '种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
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

export function GenderSpeciesRatesPage() {
  return <GameDataTableView config={genderSpeciesRatesResource} />;
}
