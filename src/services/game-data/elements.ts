import { createGameDataResourceService, type ApiRequest } from './shared';

export function createElementsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/elements', request);
}

export const elementsGameDataService = createElementsGameDataService();
