import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemCategoryPocketsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-category-pockets', request);
}

export const itemCategoryPocketsGameDataService = createItemCategoryPocketsGameDataService();
