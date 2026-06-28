import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureFormsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-forms', request);
}

export const creatureFormsGameDataService = createCreatureFormsGameDataService();
