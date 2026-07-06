import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
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
  const crud = useGameDataCrudPage({
    config: evolutionNodesResource,
    service: evolutionNodesGameDataService,
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
