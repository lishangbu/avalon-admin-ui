import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemCategoriesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-categories', request);
}

export const itemCategoriesGameDataService = createItemCategoriesGameDataService();
