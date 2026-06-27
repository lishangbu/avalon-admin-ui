import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('ability-details');

export function AbilityDetailsPage() {
  return <GameDataTableView config={resource} />;
}
