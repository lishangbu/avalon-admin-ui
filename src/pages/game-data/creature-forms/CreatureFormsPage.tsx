import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('creature-forms');

export function CreatureFormsPage() {
  return <GameDataTableView config={resource} />;
}
