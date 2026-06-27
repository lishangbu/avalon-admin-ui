import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-contest-combos');

export function SkillContestCombosPage() {
  return <GameDataTableView config={resource} />;
}
