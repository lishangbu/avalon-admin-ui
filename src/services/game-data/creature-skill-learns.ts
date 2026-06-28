import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureSkillLearnsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-skill-learns', request);
}

export const creatureSkillLearnsGameDataService = createCreatureSkillLearnsGameDataService();
