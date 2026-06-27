import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-form-elements');

export function CreatureFormElementsPage() {
  return <GameDataTableView config={resource} />;
}
