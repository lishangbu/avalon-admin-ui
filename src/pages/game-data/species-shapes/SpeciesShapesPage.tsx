import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-shapes');

export function SpeciesShapesPage() {
  return <GameDataTableView config={resource} />;
}
