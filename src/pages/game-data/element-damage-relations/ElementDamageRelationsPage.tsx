import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('element-damage-relations');

export function ElementDamageRelationsPage() {
  return <GameDataTableView config={resource} />;
}
