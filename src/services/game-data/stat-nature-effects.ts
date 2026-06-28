import { createGameDataResourceService, type ApiRequest } from './shared';

export function createStatNatureEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/stat-nature-effects', request);
}

export const statNatureEffectsGameDataService = createStatNatureEffectsGameDataService();
