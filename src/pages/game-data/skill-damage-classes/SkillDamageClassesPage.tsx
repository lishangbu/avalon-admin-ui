import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-damage-classes');

export function SkillDamageClassesPage() {
  return <GameDataTableView config={resource} />;
}
