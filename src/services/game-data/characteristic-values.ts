import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCharacteristicValuesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/characteristic-values', request);
}

export const characteristicValuesGameDataService = createCharacteristicValuesGameDataService();
