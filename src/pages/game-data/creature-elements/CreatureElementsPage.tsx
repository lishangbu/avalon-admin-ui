import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-elements');

export function CreatureElementsPage() {
  return <GameDataTableView config={resource} />;
}
