import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillTargetsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-targets', request);
}

export const skillTargetsGameDataService = createSkillTargetsGameDataService();
