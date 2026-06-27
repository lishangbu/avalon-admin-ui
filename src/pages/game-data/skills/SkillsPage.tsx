import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skills');

export function SkillsPage() {
  return <GameDataTableView config={resource} />;
}
