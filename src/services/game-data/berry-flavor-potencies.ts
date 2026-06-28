import { createGameDataResourceService, type ApiRequest } from './shared';

export function createBerryFlavorPotenciesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/berry-flavor-potencies', request);
}

export const berryFlavorPotenciesGameDataService = createBerryFlavorPotenciesGameDataService();
