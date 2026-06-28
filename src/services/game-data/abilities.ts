import { createGameDataResourceService, type ApiRequest } from './shared';

export function createAbilitiesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/abilities', request);
}

export const abilitiesGameDataService = createAbilitiesGameDataService();
