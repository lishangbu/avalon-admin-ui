import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('catalog-entries');

export function CatalogEntriesPage() {
  return <GameDataTableView config={resource} />;
}
