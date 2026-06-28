import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEvolutionChainsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/evolution-chains', request);
}

export const evolutionChainsGameDataService = createEvolutionChainsGameDataService();
