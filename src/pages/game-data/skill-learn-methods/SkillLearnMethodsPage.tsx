import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-learn-methods');

export function SkillLearnMethodsPage() {
  return <GameDataTableView config={resource} />;
}
