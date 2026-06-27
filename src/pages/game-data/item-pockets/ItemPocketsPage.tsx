import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-pockets');

export function ItemPocketsPage() {
  return <GameDataTableView config={resource} />;
}
