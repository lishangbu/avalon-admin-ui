import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creatures');

export function CreaturesPage() {
  return <GameDataTableView config={resource} />;
}
