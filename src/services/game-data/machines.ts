import { createGameDataResourceService, type ApiRequest } from './shared';

export function createMachinesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/machines', request);
}

export const machinesGameDataService = createMachinesGameDataService();
