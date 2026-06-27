import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-game-indices');

export function CreatureGameIndicesPage() {
  return <GameDataTableView config={resource} />;
}
