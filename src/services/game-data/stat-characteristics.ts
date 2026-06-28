import { createGameDataResourceService, type ApiRequest } from './shared';

export function createStatCharacteristicsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/stat-characteristics', request);
}

export const statCharacteristicsGameDataService = createStatCharacteristicsGameDataService();
