import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-creature-varieties');

export function SpeciesCreatureVarietiesPage() {
  return <GameDataTableView config={resource} />;
}
