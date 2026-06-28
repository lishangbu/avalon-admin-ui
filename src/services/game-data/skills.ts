import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skills', request);
}

export const skillsGameDataService = createSkillsGameDataService();
