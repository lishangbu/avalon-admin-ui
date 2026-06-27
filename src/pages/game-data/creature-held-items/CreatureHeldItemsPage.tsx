import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-held-items');

export function CreatureHeldItemsPage() {
  return <GameDataTableView config={resource} />;
}
