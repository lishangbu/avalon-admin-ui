import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCharacteristicsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/characteristics', request);
}

export const characteristicsGameDataService = createCharacteristicsGameDataService();
