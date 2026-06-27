import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('gender-species-rates');

export function GenderSpeciesRatesPage() {
  return <GameDataTableView config={resource} />;
}
