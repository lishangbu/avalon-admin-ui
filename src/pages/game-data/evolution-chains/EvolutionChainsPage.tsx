import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('evolution-chains');

export function EvolutionChainsPage() {
  return <GameDataTableView config={resource} />;
}
