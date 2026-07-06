import { GameDataCrudTable } from '../GameDataCrudTable';
import { genderEvolutionRequirementsGameDataService } from '../../../services/game-data/gender-evolution-requirements';
import type { GameDataResourceConfig } from '../game-data-resources';

export const genderEvolutionRequirementsResource: GameDataResourceConfig = {
  key: 'gender-evolution-requirements',
  path: '/game-data/gender-evolution-requirements',
  title: '性别进化要求',
  description: '维护性别进化要求。',
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
  ],
};

export function GenderEvolutionRequirementsPage() {
  return (
    <GameDataCrudTable
      config={genderEvolutionRequirementsResource}
      service={genderEvolutionRequirementsGameDataService}
    />
  );
}
