import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('evolution-nodes');

export function EvolutionNodesPage() {
  return <GameDataTableView config={resource} />;
}
