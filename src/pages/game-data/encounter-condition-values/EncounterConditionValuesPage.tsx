import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('encounter-condition-values');

export function EncounterConditionValuesPage() {
  return <GameDataTableView config={resource} />;
}
