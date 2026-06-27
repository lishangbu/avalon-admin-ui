import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('characteristic-values');

export function CharacteristicValuesPage() {
  return <GameDataTableView config={resource} />;
}
