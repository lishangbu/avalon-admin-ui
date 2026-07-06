import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { itemAttributeBindingsGameDataService } from '../../../services/game-data/item-attribute-bindings';
import type { GameDataResourceConfig } from '../game-data-resources';

export const itemAttributeBindingsResource: GameDataResourceConfig = {
  key: 'item-attribute-bindings',
  path: '/game-data/item-attribute-bindings',
  title: '道具属性绑定',
  description: '维护道具属性绑定。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'items',
      },
      filter: true,
    },
    {
      name: 'attribute_id',
      label: '属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'item-attributes',
      },
      filter: true,
    },
  ],
};

export function ItemAttributeBindingsPage() {
  const crud = useGameDataCrudPage({
    config: itemAttributeBindingsResource,
    service: itemAttributeBindingsGameDataService,
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
