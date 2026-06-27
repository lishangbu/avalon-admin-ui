import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('growth-rates');

export function GrowthRatesPage() {
  return <GameDataTableView config={resource} />;
}
