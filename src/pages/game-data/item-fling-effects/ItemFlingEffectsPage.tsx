import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-fling-effects');

export function ItemFlingEffectsPage() {
  return <GameDataTableView config={resource} />;
}
