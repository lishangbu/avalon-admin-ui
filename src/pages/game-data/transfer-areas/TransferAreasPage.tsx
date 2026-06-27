import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('transfer-areas');

export function TransferAreasPage() {
  return <GameDataTableView config={resource} />;
}
