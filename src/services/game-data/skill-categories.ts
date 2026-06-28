import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillCategoriesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-categories', request);
}

export const skillCategoriesGameDataService = createSkillCategoriesGameDataService();
