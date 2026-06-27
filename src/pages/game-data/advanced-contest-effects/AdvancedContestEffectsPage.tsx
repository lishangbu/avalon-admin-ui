import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('advanced-contest-effects');

export function AdvancedContestEffectsPage() {
  return <GameDataTableView config={resource} />;
}
