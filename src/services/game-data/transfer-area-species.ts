import { createGameDataResourceService, type ApiRequest } from './shared';

export function createTransferAreaSpeciesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/transfer-area-species', request);
}

export const transferAreaSpeciesGameDataService = createTransferAreaSpeciesGameDataService();
