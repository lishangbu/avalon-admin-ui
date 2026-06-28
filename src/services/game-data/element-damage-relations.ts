import { createGameDataResourceService, type ApiRequest } from './shared';

export function createElementDamageRelationsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/element-damage-relations', request);
}

export const elementDamageRelationsGameDataService = createElementDamageRelationsGameDataService();
