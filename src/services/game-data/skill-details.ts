import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillDetailsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-details', request);
}

export const skillDetailsGameDataService = createSkillDetailsGameDataService();
