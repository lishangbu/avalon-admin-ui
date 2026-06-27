import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('item-attribute-bindings');

export function ItemAttributeBindingsPage() {
  return <GameDataTableView config={resource} />;
}
