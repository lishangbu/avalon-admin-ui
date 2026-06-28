import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEncounterConditionsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/encounter-conditions', request);
}

export const encounterConditionsGameDataService = createEncounterConditionsGameDataService();
