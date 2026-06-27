import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('event-stat-nature-effects');

export function EventStatNatureEffectsPage() {
  return <GameDataTableView config={resource} />;
}
