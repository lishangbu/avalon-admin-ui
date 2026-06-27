import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-details');

export function ItemDetailsPage() {
  return <GameDataTableView config={resource} />;
}
