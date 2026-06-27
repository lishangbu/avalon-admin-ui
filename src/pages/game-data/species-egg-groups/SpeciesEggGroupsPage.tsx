import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('species-egg-groups');

export function SpeciesEggGroupsPage() {
  return <GameDataTableView config={resource} />;
}
