import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('natures');

export function NaturesPage() {
  return <GameDataTableView config={resource} />;
}
