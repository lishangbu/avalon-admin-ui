import { createGameDataResourceService, type ApiRequest } from './shared';

export function createContestTypesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/contest-types', request);
}

export const contestTypesGameDataService = createContestTypesGameDataService();
