import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('stats');

export function StatsPage() {
  return <GameDataTableView config={resource} />;
}
