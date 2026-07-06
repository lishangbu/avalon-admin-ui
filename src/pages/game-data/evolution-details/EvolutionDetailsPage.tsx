import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { evolutionDetailsGameDataService } from '../../../services/game-data/evolution-details';
import type { GameDataResourceConfig } from '../game-data-resources';

export const evolutionDetailsResource: GameDataResourceConfig = {
  key: 'evolution-details',
  path: '/game-data/evolution-details',
  title: '进化条件',
  description: '维护进化条件。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'chain_id',
      label: '进化链',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'evolution-chains',
      },
    },
    {
      name: 'from_species_id',
      label: '起始种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'to_species_id',
      label: '目标种类',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'species',
      },
      filter: true,
    },
    {
      name: 'trigger_id',
      label: '触发器',
      type: 'long',
      width: 120,
      reference: {
        resource: 'evolution-triggers',
      },
      filter: true,
    },
    {
      name: 'item_id',
      label: '道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
    },
    {
      name: 'held_item_id',
      label: '持有道具',
      type: 'long',
      width: 120,
      reference: {
        resource: 'items',
      },
    },
    {
      name: 'known_skill_id',
      label: '已掌握技能',
      type: 'long',
      width: 120,
      reference: {
        resource: 'skills',
      },
    },
    {
      name: 'known_element_id',
      label: '已掌握属性',
      type: 'long',
      width: 120,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'location_id',
      label: '地点',
      type: 'long',
      width: 120,
      reference: {
        resource: 'locations',
      },
    },
    {
      name: 'party_species_id',
      label: '队伍种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'party_element_id',
      label: '队伍属性',
      type: 'long',
      width: 120,
      reference: {
        resource: 'elements',
      },
    },
    {
      name: 'trade_species_id',
      label: '交换种类',
      type: 'long',
      width: 120,
      reference: {
        resource: 'species',
      },
    },
    {
      name: 'gender_id',
      label: '性别',
      type: 'long',
      width: 120,
      reference: {
        resource: 'genders',
      },
    },
    {
      name: 'region_id',
      label: '地区',
      type: 'long',
      width: 120,
      reference: {
        resource: 'regions',
      },
    },
    {
      name: 'min_level',
      label: '最低等级',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_happiness',
      label: '最低亲和度',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_beauty',
      label: '最低美丽度',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_affection',
      label: '最低友好度',
      type: 'int',
      width: 120,
    },
    {
      name: 'relative_physical_stats',
      label: '物攻物防关系',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_damage_taken',
      label: '最低承伤',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_move_count',
      label: '最低技能数',
      type: 'int',
      width: 120,
    },
    {
      name: 'min_steps',
      label: '最低步数',
      type: 'int',
      width: 120,
    },
    {
      name: 'time_of_day',
      label: '时间段',
      type: 'string',
      width: 180,
    },
    {
      name: 'needs_overworld_rain',
      label: '需要下雨',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'turn_upside_down',
      label: '需要倒置',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'near_special_rock',
      label: '靠近特殊岩石',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'needs_multiplayer',
      label: '需要多人',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
    {
      name: 'is_default',
      label: '默认条件',
      type: 'boolean',
      defaultValue: false,
      width: 110,
    },
  ],
};

export function EvolutionDetailsPage() {
  const crud = useGameDataCrudPage({
    config: evolutionDetailsResource,
    service: evolutionDetailsGameDataService,
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
