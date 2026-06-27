import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('contest-types');

export function ContestTypesPage() {
  return <GameDataTableView config={resource} />;
}
