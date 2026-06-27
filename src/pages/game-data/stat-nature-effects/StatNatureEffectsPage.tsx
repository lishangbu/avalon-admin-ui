import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('stat-nature-effects');

export function StatNatureEffectsPage() {
  return <GameDataTableView config={resource} />;
}
