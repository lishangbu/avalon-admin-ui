import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('encounter-methods');

export function EncounterMethodsPage() {
  return <GameDataTableView config={resource} />;
}
