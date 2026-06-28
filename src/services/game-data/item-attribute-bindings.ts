import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemAttributeBindingsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-attribute-bindings', request);
}

export const itemAttributeBindingsGameDataService = createItemAttributeBindingsGameDataService();
