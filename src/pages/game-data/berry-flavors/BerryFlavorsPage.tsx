import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { berryFlavorsGameDataService } from '../../../services/game-data/berry-flavors';
import type { GameDataResourceConfig } from '../game-data-resources';

export const berryFlavorsResource: GameDataResourceConfig = {
  key: 'berry-flavors',
  path: '/game-data/berry-flavors',
  title: '树果口味',
  description: '维护树果口味。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 190,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'contest_type_id',
      label: '评分类别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'contest-types',
      },
      filter: true,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function BerryFlavorsPage() {
  const crud = useGameDataCrudPage({
    config: berryFlavorsResource,
    service: berryFlavorsGameDataService,
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
