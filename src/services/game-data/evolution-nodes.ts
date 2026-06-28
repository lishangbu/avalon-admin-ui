import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEvolutionNodesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/evolution-nodes', request);
}

export const evolutionNodesGameDataService = createEvolutionNodesGameDataService();
