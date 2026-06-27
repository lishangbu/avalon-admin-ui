import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-colors');

export function SpeciesColorsPage() {
  return <GameDataTableView config={resource} />;
}
