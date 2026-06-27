import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-game-indices');

export function ItemGameIndicesPage() {
  return <GameDataTableView config={resource} />;
}
