import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-learn-method-version-groups');

export function SkillLearnMethodVersionGroupsPage() {
  return <GameDataTableView config={resource} />;
}
