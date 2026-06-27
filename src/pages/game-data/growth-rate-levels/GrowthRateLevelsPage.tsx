import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('growth-rate-levels');

export function GrowthRateLevelsPage() {
  return <GameDataTableView config={resource} />;
}
