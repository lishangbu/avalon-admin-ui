import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('location-area-method-rates');

export function LocationAreaMethodRatesPage() {
  return <GameDataTableView config={resource} />;
}
