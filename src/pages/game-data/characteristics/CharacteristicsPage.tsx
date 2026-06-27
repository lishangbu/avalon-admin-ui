import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('characteristics');

export function CharacteristicsPage() {
  return <GameDataTableView config={resource} />;
}
