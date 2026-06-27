import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('catalogs');

export function CatalogsPage() {
  return <GameDataTableView config={resource} />;
}
