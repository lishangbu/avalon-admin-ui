import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-targets');

export function SkillTargetsPage() {
  return <GameDataTableView config={resource} />;
}
