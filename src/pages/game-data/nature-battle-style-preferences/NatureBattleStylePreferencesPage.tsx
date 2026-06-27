import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('nature-battle-style-preferences');

export function NatureBattleStylePreferencesPage() {
  return <GameDataTableView config={resource} />;
}
