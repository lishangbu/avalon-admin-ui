import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('stat-characteristics');

export function StatCharacteristicsPage() {
  return <GameDataTableView config={resource} />;
}
