import { createGameDataResourceService, type ApiRequest } from './shared';

export function createContestEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/contest-effects', request);
}

export const contestEffectsGameDataService = createContestEffectsGameDataService();
