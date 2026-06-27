import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-catalog-numbers');

export function SpeciesCatalogNumbersPage() {
  return <GameDataTableView config={resource} />;
}
