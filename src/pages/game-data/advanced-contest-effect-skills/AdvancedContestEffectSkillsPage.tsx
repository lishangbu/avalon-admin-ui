import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('advanced-contest-effect-skills');

export function AdvancedContestEffectSkillsPage() {
  return <GameDataTableView config={resource} />;
}
