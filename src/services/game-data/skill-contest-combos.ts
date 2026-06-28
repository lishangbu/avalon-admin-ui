import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillContestCombosGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-contest-combos', request);
}

export const skillContestCombosGameDataService = createSkillContestCombosGameDataService();
