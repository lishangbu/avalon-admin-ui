import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species');

export function SpeciesPage() {
  return <GameDataTableView config={resource} />;
}
