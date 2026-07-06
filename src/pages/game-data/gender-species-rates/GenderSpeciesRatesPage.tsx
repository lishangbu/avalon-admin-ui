import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { genderSpeciesRatesGameDataService } from '../../../services/game-data/gender-species-rates';
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
  const crud = useGameDataCrudPage({
    config: genderSpeciesRatesResource,
    service: genderSpeciesRatesGameDataService,
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
