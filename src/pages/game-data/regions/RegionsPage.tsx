import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('regions');

export function RegionsPage() {
  return <GameDataTableView config={resource} />;
}
