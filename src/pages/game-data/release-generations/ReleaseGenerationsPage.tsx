import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('release-generations');

export function ReleaseGenerationsPage() {
  return <GameDataTableView config={resource} />;
}
