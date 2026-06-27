import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-skill-learns');

export function CreatureSkillLearnsPage() {
  return <GameDataTableView config={resource} />;
}
