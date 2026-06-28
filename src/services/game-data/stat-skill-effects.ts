import { createGameDataResourceService, type ApiRequest } from './shared';

export function createStatSkillEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/stat-skill-effects', request);
}

export const statSkillEffectsGameDataService = createStatSkillEffectsGameDataService();
