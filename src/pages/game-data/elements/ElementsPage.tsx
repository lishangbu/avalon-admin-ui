import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('elements');

export function ElementsPage() {
  return <GameDataTableView config={resource} />;
}
