import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillDamageClassesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-damage-classes', request);
}

export const skillDamageClassesGameDataService = createSkillDamageClassesGameDataService();
