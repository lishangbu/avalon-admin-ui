import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('catalog-version-groups');

export function CatalogVersionGroupsPage() {
  return <GameDataTableView config={resource} />;
}
