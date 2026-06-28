import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEncounterConditionValuesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/encounter-condition-values', request);
}

export const encounterConditionValuesGameDataService =
  createEncounterConditionValuesGameDataService();
