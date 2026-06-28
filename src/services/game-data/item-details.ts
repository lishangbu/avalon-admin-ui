import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemDetailsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-details', request);
}

export const itemDetailsGameDataService = createItemDetailsGameDataService();
