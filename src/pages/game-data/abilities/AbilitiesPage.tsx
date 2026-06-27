import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('abilities');

export function AbilitiesPage() {
  return <GameDataTableView config={resource} />;
}
