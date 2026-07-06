import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
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
  const crud = useGameDataCrudPage({
    config: genderEvolutionRequirementsResource,
    service: genderEvolutionRequirementsGameDataService,
  });

  return (
    <div className="space-y-4">
      <GameDataCrudHeader {...crud.headerProps} />
      <GameDataFilterBar {...crud.filterBarProps} />
      <GameDataRecordTable {...crud.recordTableProps} />
      <EntityDrawer {...crud.detailDrawerProps} />
      <GameDataEditModal {...crud.editModalProps} />
    </div>
  );
}
