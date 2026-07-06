import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { catalogEntriesGameDataService } from '../../../services/game-data/catalog-entries';
import type { GameDataResourceConfig } from '../game-data-resources';

export const catalogEntriesResource: GameDataResourceConfig = {
  key: 'catalog-entries',
  path: '/game-data/catalog-entries',
  title: '图鉴目录条目',
  description: '维护图鉴目录条目。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'entry_number',
      label: '目录编号',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function CatalogEntriesPage() {
  const crud = useGameDataCrudPage({
    config: catalogEntriesResource,
    service: catalogEntriesGameDataService,
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
