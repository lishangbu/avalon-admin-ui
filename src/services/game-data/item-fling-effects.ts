import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemFlingEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-fling-effects', request);
}

export const itemFlingEffectsGameDataService = createItemFlingEffectsGameDataService();
