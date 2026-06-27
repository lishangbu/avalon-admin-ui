import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-ailments');

export function SkillAilmentsPage() {
  return <GameDataTableView config={resource} />;
}
