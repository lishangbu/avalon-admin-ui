import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('machines');

export function MachinesPage() {
  return <GameDataTableView config={resource} />;
}
