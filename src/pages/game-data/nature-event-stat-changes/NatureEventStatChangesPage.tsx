import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('nature-event-stat-changes');

export function NatureEventStatChangesPage() {
  return <GameDataTableView config={resource} />;
}
