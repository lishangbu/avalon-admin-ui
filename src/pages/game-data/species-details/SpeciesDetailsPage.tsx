import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { speciesDetailsGameDataService } from '../../../services/game-data/species-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const speciesDetailsResource: GameDataResourceConfig = {
  key: 'species-details',
  path: '/game-data/species-details',
  title: '种类详情',
  description: '维护种类详情。',
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
    },
    {
      name: 'growth_rate_id',
      label: '成长速率',
      type: 'long',
      width: 120,
      reference: {
        resource: 'growth-rates',
      },
    },
    {
      name: 'evolves_from_species_id',
      label: '进化来源种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'evolution_chain_id',
      label: '进化链',
      type: 'long',
      width: 120,
      reference: {
        resource: 'evolution-chains',
      },
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      width: 120,
    },
    {
      name: 'gender_differences',
      label: '性别差异',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'forms_switchable',
      label: '形态可切换',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'genus',
      label: '分类',
      type: 'string',
      width: 180,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function SpeciesDetailsPage() {
  const crud = useGameDataCrudPage({
    config: speciesDetailsResource,
    service: speciesDetailsGameDataService,
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
