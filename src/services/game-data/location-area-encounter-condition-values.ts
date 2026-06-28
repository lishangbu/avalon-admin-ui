import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationAreaEncounterConditionValuesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService(
    '/api/game-data/location-area-encounter-condition-values',
    request,
  );
}

export const locationAreaEncounterConditionValuesGameDataService =
  createLocationAreaEncounterConditionValuesGameDataService();
