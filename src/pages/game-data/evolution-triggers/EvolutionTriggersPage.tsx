import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('evolution-triggers');

export function EvolutionTriggersPage() {
  return <GameDataTableView config={resource} />;
}
