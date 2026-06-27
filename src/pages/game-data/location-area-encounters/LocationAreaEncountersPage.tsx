import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('location-area-encounters');

export function LocationAreaEncountersPage() {
  return <GameDataTableView config={resource} />;
}
