import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEncounterMethodsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/encounter-methods', request);
}

export const encounterMethodsGameDataService = createEncounterMethodsGameDataService();
