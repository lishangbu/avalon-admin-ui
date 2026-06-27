import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-stat-changes');

export function SkillStatChangesPage() {
  return <GameDataTableView config={resource} />;
}
