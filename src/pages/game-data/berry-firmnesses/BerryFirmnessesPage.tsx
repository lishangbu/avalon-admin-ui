import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('berry-firmnesses');

export function BerryFirmnessesPage() {
  return <GameDataTableView config={resource} />;
}
