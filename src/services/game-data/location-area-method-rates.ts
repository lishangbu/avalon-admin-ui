import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationAreaMethodRatesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/location-area-method-rates', request);
}

export const locationAreaMethodRatesGameDataService =
  createLocationAreaMethodRatesGameDataService();
