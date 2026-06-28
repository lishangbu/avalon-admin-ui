import { GameDataTableView } from '../GameDataTableView';
import { evolutionNodesGameDataService } from '../../../services/game-data/evolution-nodes';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionNodesResource: GameDataResourceConfig = {
  key: 'evolution-nodes',
  path: '/game-data/evolution-nodes',
  title: '进化链节点',
  description: '维护进化链节点。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'chain_id',
      label: '进化链',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'evolution-chains',
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
      name: 'parent_species_id',
      label: '父级种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'baby',
      label: '幼体',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'node_order',
      label: '节点顺序',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function EvolutionNodesPage() {
  return (
    <GameDataTableView config={evolutionNodesResource} service={evolutionNodesGameDataService} />
  );
}
