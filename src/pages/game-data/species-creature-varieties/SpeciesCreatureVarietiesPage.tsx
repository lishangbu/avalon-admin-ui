import { GameDataCrudTable } from '../GameDataCrudTable';
import { speciesCreatureVarietiesGameDataService } from '../../../services/game-data/species-creature-varieties';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesCreatureVarietiesResource: GameDataResourceConfig = {
  key: 'species-creature-varieties',
  path: '/game-data/species-creature-varieties',
  title: '种类精灵变种',
  description: '维护种类精灵变种。',
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
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creatures',
      },
      filter: true,
    },
    {
      name: 'default_variety',
      label: '默认变种',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
  ],
};

export function SpeciesCreatureVarietiesPage() {
  return (
    <GameDataCrudTable
      config={speciesCreatureVarietiesResource}
      service={speciesCreatureVarietiesGameDataService}
    />
  );
}
