import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('berry-flavors');

export function BerryFlavorsPage() {
  return <GameDataTableView config={resource} />;
}
