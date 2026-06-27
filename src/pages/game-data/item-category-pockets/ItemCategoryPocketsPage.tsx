import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-category-pockets');

export function ItemCategoryPocketsPage() {
  return <GameDataTableView config={resource} />;
}
