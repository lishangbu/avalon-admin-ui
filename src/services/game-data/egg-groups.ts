import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEggGroupsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/egg-groups', request);
}

export const eggGroupsGameDataService = createEggGroupsGameDataService();
