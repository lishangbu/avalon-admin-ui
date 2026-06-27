import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('encounter-conditions');

export function EncounterConditionsPage() {
  return <GameDataTableView config={resource} />;
}
