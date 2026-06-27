import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-attributes');

export function ItemAttributesPage() {
  return <GameDataTableView config={resource} />;
}
