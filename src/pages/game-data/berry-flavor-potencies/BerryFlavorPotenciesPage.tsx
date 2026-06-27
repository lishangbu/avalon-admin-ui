import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('berry-flavor-potencies');

export function BerryFlavorPotenciesPage() {
  return <GameDataTableView config={resource} />;
}
