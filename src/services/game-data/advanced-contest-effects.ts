import { createGameDataResourceService, type ApiRequest } from './shared';

export function createAdvancedContestEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/advanced-contest-effects', request);
}

export const advancedContestEffectsGameDataService = createAdvancedContestEffectsGameDataService();
