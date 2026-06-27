import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('gender-evolution-requirements');

export function GenderEvolutionRequirementsPage() {
  return <GameDataTableView config={resource} />;
}
