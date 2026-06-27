import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('locations');

export function LocationsPage() {
  return <GameDataTableView config={resource} />;
}
