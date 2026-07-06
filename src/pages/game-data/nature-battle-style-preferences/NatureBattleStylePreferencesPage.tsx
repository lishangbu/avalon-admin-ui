import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { GameDataCrudHeader } from '../GameDataCrudHeader';
import { GameDataEditModal } from '../GameDataEditModal';
import { GameDataFilterBar } from '../GameDataFilterBar';
import { GameDataRecordTable } from '../GameDataRecordTable';
import { useGameDataCrudPage } from '../useGameDataCrudPage';
import { natureBattleStylePreferencesGameDataService } from '../../../services/game-data/nature-battle-style-preferences';
import type { GameDataResourceConfig } from '../game-data-resources';

export const natureBattleStylePreferencesResource: GameDataResourceConfig = {
  key: 'nature-battle-style-preferences',
  path: '/game-data/nature-battle-style-preferences',
  title: '性格战斗风格偏好',
  description: '维护性格战斗风格偏好。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'nature_id',
      label: '性格',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'natures',
      },
      filter: true,
    },
    {
      name: 'battle_style_id',
      label: '战斗风格',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'skill-battle-styles',
      },
      filter: true,
    },
    {
      name: 'low_hp_preference',
      label: '低体力偏好',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'high_hp_preference',
      label: '高体力偏好',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function NatureBattleStylePreferencesPage() {
  const crud = useGameDataCrudPage({
    config: natureBattleStylePreferencesResource,
    service: natureBattleStylePreferencesGameDataService,
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
