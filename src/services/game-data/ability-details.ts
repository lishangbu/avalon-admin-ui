import { createGameDataResourceService, type ApiRequest } from './shared';

export function createAbilityDetailsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/ability-details', request);
}

export const abilityDetailsGameDataService = createAbilityDetailsGameDataService();
