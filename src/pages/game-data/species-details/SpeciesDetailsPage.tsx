import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-details');

export function SpeciesDetailsPage() {
  return <GameDataTableView config={resource} />;
}
