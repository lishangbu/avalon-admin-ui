import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('version-groups');

export function VersionGroupsPage() {
  return <GameDataTableView config={resource} />;
}
