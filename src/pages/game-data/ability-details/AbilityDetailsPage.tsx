import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { abilityDetailsGameDataService } from '../../../services/game-data/ability-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const abilityDetailsResource: GameDataResourceConfig = {
  key: 'ability-details',
  path: '/game-data/ability-details',
  title: '特性详情',
  description: '维护特性详情。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'ability_id',
      label: '特性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'abilities',
      },
      filter: true,
    },
    {
      name: 'effect',
      label: '效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'short_effect',
      label: '短效果',
      type: 'string',
      width: 280,
    },
    {
      name: 'flavor_text',
      label: '风味说明',
      type: 'string',
      width: 280,
    },
  ],
};

export function AbilityDetailsPage() {
  const crud = useGameDataCrudPage({
    config: abilityDetailsResource,
    service: abilityDetailsGameDataService,
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
