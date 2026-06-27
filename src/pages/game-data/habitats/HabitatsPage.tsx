import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('habitats');

export function HabitatsPage() {
  return <GameDataTableView config={resource} />;
}
