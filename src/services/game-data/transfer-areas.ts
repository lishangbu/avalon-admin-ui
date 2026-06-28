import { createGameDataResourceService, type ApiRequest } from './shared';

export function createTransferAreasGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/transfer-areas', request);
}

export const transferAreasGameDataService = createTransferAreasGameDataService();
