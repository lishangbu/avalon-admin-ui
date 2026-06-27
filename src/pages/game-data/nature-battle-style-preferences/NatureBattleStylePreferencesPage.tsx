import { GameDataTableView } from '../GameDataTableView';
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
  return <GameDataTableView config={natureBattleStylePreferencesResource} />;
}
