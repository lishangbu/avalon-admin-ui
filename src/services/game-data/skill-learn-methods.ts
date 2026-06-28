import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillLearnMethodsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-learn-methods', request);
}

export const skillLearnMethodsGameDataService = createSkillLearnMethodsGameDataService();
