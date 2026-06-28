import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEvolutionTriggersGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/evolution-triggers', request);
}

export const evolutionTriggersGameDataService = createEvolutionTriggersGameDataService();
