import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { catalogsGameDataService } from '../../../services/game-data/catalogs';
import type { GameDataResourceConfig } from '../game-data-resources';

export const catalogsResource: GameDataResourceConfig = {
  key: 'catalogs',
  path: '/game-data/catalogs',
  title: '图鉴目录',
  description: '维护图鉴目录。',
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
      name: 'region_id',
      label: '地区',
      type: 'long',
      width: 120,
      reference: {
        resource: 'regions',
      },
      filter: true,
    },
    {
      name: 'main_series',
      label: '主体资料',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'description',
      label: '说明',
      type: 'string',
      width: 280,
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

export function CatalogsPage() {
  const crud = useGameDataCrudPage({ config: catalogsResource, service: catalogsGameDataService });

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
