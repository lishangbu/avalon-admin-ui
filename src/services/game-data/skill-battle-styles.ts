import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillBattleStylesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-battle-styles', request);
}

export const skillBattleStylesGameDataService = createSkillBattleStylesGameDataService();
