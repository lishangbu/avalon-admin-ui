import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-abilities');

export function CreatureAbilitiesPage() {
  return <GameDataTableView config={resource} />;
}
