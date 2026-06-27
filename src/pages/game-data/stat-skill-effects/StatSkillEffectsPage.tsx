import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('stat-skill-effects');

export function StatSkillEffectsPage() {
  return <GameDataTableView config={resource} />;
}
