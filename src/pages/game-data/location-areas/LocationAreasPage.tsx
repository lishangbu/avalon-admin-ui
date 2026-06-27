import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('location-areas');

export function LocationAreasPage() {
  return <GameDataTableView config={resource} />;
}
