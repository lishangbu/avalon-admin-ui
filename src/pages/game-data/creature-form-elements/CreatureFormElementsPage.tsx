import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { creatureFormElementsGameDataService } from '../../../services/game-data/creature-form-elements';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureFormElementsResource: GameDataResourceConfig = {
  key: 'creature-form-elements',
  path: '/game-data/creature-form-elements',
  title: '精灵形态属性',
  description: '维护精灵形态属性。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'form_id',
      label: '形态',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'creature-forms',
      },
      filter: true,
    },
    {
      name: 'element_id',
      label: '属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'elements',
      },
      filter: true,
    },
    {
      name: 'slot_order',
      label: '槽位顺序',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function CreatureFormElementsPage() {
  const crud = useGameDataCrudPage({
    config: creatureFormElementsResource,
    service: creatureFormElementsGameDataService,
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
