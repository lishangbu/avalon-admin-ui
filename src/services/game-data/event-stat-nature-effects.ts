import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEventStatNatureEffectsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/event-stat-nature-effects', request);
}

export const eventStatNatureEffectsGameDataService = createEventStatNatureEffectsGameDataService();
