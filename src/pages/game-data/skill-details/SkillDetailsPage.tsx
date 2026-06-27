import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-details');

export function SkillDetailsPage() {
  return <GameDataTableView config={resource} />;
}
