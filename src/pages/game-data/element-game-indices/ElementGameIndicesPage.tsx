import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('element-game-indices');

export function ElementGameIndicesPage() {
  return <GameDataTableView config={resource} />;
}
