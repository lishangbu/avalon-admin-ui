import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillStatChangesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-stat-changes', request);
}

export const skillStatChangesGameDataService = createSkillStatChangesGameDataService();
