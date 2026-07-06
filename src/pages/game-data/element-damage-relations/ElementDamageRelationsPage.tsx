import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { elementDamageRelationsGameDataService } from '../../../services/game-data/element-damage-relations';
import type { GameDataResourceConfig } from '../game-data-resources';

export const elementDamageRelationsResource: GameDataResourceConfig = {
  key: 'element-damage-relations',
  path: '/game-data/element-damage-relations',
  title: '属性克制关系',
  description: '维护属性克制关系。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'source_element_id',
      label: '来源属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'elements',
      },
      filter: true,
    },
    {
      name: 'target_element_id',
      label: '目标属性',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'elements',
      },
      filter: true,
    },
    {
      name: 'relation_type',
      label: '关系类型',
      type: 'string',
      required: true,
      width: 180,
    },
  ],
};

export function ElementDamageRelationsPage() {
  const crud = useGameDataCrudPage({
    config: elementDamageRelationsResource,
    service: elementDamageRelationsGameDataService,
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
