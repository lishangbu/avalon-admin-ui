import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('versions');

export function VersionsPage() {
  return <GameDataTableView config={resource} />;
}
