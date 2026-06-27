import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-stats');

export function CreatureStatsPage() {
  return <GameDataTableView config={resource} />;
}
