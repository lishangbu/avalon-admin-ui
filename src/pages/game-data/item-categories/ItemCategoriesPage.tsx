import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-categories');

export function ItemCategoriesPage() {
  return <GameDataTableView config={resource} />;
}
