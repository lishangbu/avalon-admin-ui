import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('genders');

export function GendersPage() {
  return <GameDataTableView config={resource} />;
}
