import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { elementGameIndicesGameDataService } from '../../../services/game-data/element-game-indices';
import type { GameDataResourceConfig } from '../game-data-resources';

export const elementGameIndicesResource: GameDataResourceConfig = {
  key: 'element-game-indices',
  path: '/game-data/element-game-indices',
  title: '属性索引',
  description: '维护属性索引。',
  searchPlaceholder: '关键字',
  fields: [
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
      name: 'game_index',
      label: '索引',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function ElementGameIndicesPage() {
  const crud = useGameDataCrudPage({
    config: elementGameIndicesResource,
    service: elementGameIndicesGameDataService,
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
