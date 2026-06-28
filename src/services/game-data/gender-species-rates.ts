import { createGameDataResourceService, type ApiRequest } from './shared';

export function createGenderSpeciesRatesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/gender-species-rates', request);
}

export const genderSpeciesRatesGameDataService = createGenderSpeciesRatesGameDataService();
