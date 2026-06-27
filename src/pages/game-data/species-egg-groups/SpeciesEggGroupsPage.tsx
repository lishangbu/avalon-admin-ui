import { GameDataTableView } from '../GameDataTableView';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesEggGroupsResource: GameDataResourceConfig = {
  key: 'species-egg-groups',
  path: '/game-data/species-egg-groups',
  title: '种类分组绑定',
  description: '维护种类与分组的多对多关系。',
  searchPlaceholder: '种类或分组',
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
      name: 'egg_group_id',
      label: '分组',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'egg-groups',
      },
      filter: true,
    },
    {
      name: 'slot_order',
      label: '槽位',
      type: 'int',
      required: true,
      width: 100,
    },
  ],
};

export function SpeciesEggGroupsPage() {
  return <GameDataTableView config={speciesEggGroupsResource} />;
}
