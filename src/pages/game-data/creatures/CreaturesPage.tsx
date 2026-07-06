import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { creaturesGameDataService } from '../../../services/game-data/creatures';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creaturesResource: GameDataResourceConfig = {
  key: 'creatures',
  path: '/game-data/creatures',
  title: '精灵资料',
  description: '维护精灵条目的名称、所属种类、尺寸和基础经验。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'species_id',
      label: '种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'height',
      label: '高度',
      type: 'int',
      width: 100,
    },
    {
      name: 'weight',
      label: '重量',
      type: 'int',
      width: 100,
    },
    {
      name: 'base_experience',
      label: '基础经验',
      type: 'int',
      width: 120,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      width: 100,
    },
    {
      name: 'default_form',
      label: '默认形态',
      type: 'boolean',
      defaultValue: true,
      width: 120,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function CreaturesPage() {
  const crud = useGameDataCrudPage({
    config: creaturesResource,
    service: creaturesGameDataService,
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
