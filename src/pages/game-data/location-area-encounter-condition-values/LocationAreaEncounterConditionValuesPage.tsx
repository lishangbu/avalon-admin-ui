import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('location-area-encounter-condition-values');

export function LocationAreaEncounterConditionValuesPage() {
  return <GameDataTableView config={resource} />;
}
