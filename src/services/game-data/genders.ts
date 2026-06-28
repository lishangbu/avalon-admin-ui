import { createGameDataResourceService, type ApiRequest } from './shared';

export function createGendersGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/genders', request);
}

export const gendersGameDataService = createGendersGameDataService();
