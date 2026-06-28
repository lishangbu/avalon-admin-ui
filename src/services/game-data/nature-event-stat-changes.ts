import { createGameDataResourceService, type ApiRequest } from './shared';

export function createNatureEventStatChangesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/nature-event-stat-changes', request);
}

export const natureEventStatChangesGameDataService = createNatureEventStatChangesGameDataService();
