import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('berries');

export function BerriesPage() {
  return <GameDataTableView config={resource} />;
}
