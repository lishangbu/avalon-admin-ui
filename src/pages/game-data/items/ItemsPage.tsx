import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('items');

export function ItemsPage() {
  return <GameDataTableView config={resource} />;
}
