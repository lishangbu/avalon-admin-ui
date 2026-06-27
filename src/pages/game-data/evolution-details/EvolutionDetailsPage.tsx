import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('evolution-details');

export function EvolutionDetailsPage() {
  return <GameDataTableView config={resource} />;
}
