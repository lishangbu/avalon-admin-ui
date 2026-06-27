import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('contest-effects');

export function ContestEffectsPage() {
  return <GameDataTableView config={resource} />;
}
