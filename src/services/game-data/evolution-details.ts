import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEvolutionDetailsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/evolution-details', request);
}

export const evolutionDetailsGameDataService = createEvolutionDetailsGameDataService();
