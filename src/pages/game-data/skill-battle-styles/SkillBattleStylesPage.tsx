import { GameDataTableView } from '../GameDataTableView';
import { mustFindGameDataResource } from '../game-data-resources';

const resource = mustFindGameDataResource('skill-battle-styles');

export function SkillBattleStylesPage() {
  return <GameDataTableView config={resource} />;
}
