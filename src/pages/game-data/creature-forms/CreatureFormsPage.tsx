import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { creatureFormsGameDataService } from '../../../services/game-data/creature-forms';
import type { GameDataResourceConfig } from '../game-data-resources';

export const creatureFormsResource: GameDataResourceConfig = {
  key: 'creature-forms',
  path: '/game-data/creature-forms',
  title: '精灵形态',
  description: '维护精灵形态。',
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
      name: 'creature_id',
      label: '精灵',
      type: 'long',
      width: 120,
      reference: {
        resource: 'creatures',
      },
    },
    {
      name: 'form_name',
      label: '形态名',
      type: 'string',
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      width: 120,
    },
    {
      name: 'form_order',
      label: '形态排序',
      type: 'int',
      width: 120,
    },
    {
      name: 'battle_only',
      label: '仅战斗',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'default_form',
      label: '默认形态',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
    },
    {
      name: 'enhanced_form',
      label: '强化形态',
      type: 'boolean',
      required: true,
      defaultValue: false,
      width: 110,
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

export function CreatureFormsPage() {
  const crud = useGameDataCrudPage({
    config: creatureFormsResource,
    service: creatureFormsGameDataService,
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
