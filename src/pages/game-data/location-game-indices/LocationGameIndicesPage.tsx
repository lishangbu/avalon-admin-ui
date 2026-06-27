import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('location-game-indices');

export function LocationGameIndicesPage() {
  return <GameDataTableView config={resource} />;
}
