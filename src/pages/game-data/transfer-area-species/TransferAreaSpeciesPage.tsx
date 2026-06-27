import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('transfer-area-species');

export function TransferAreaSpeciesPage() {
  return <GameDataTableView config={resource} />;
}
