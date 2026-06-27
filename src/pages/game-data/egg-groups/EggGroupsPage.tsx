import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('egg-groups');

export function EggGroupsPage() {
  return <GameDataTableView config={resource} />;
}
