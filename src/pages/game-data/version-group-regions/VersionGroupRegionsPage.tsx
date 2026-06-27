import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('version-group-regions');

export function VersionGroupRegionsPage() {
  return <GameDataTableView config={resource} />;
}
