import { createGameDataResourceService, type ApiRequest } from './shared';

export function createHabitatsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/habitats', request);
}

export const habitatsGameDataService = createHabitatsGameDataService();
