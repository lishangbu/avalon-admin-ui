import { GameDataTableView } from '../GameDataTableView';
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
  return (
    <GameDataTableView
      config={speciesCatalogNumbersResource}
      service={speciesCatalogNumbersGameDataService}
    />
  );
}
