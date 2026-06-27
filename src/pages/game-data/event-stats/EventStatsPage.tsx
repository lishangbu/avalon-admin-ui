import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('event-stats');

export function EventStatsPage() {
  return <GameDataTableView config={resource} />;
}
