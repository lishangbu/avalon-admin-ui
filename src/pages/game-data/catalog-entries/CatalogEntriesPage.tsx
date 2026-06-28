import { GameDataTableView } from '../GameDataTableView';
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
  return (
    <GameDataTableView config={catalogEntriesResource} service={catalogEntriesGameDataService} />
  );
}
