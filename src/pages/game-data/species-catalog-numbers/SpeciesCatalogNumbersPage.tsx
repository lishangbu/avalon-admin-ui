import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { speciesCatalogNumbersGameDataService } from '../../../services/game-data/species-catalog-numbers';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesCatalogNumbersResource: GameDataResourceConfig = {
  key: 'species-catalog-numbers',
  path: '/game-data/species-catalog-numbers',
  title: '种类目录编号',
  description: '维护种类目录编号。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'catalog_id',
      label: '目录',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'catalogs',
      },
      filter: true,
    },
    {
      name: 'entry_number',
      label: '目录编号',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function SpeciesCatalogNumbersPage() {
  const crud = useGameDataCrudPage({
    config: speciesCatalogNumbersResource,
    service: speciesCatalogNumbersGameDataService,
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
