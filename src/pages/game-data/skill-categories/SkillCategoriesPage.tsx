import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-categories');

export function SkillCategoriesPage() {
  return <GameDataTableView config={resource} />;
}
