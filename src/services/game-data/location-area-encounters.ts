import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationAreaEncountersGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/location-area-encounters', request);
}

export const locationAreaEncountersGameDataService = createLocationAreaEncountersGameDataService();
