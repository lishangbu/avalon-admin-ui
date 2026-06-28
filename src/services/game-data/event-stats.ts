import { createGameDataResourceService, type ApiRequest } from './shared';

export function createEventStatsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/event-stats', request);
}

export const eventStatsGameDataService = createEventStatsGameDataService();
