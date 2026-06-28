import { createGameDataResourceService, type ApiRequest } from './shared';

export function createNatureBattleStylePreferencesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/nature-battle-style-preferences', request);
}

export const natureBattleStylePreferencesGameDataService =
  createNatureBattleStylePreferencesGameDataService();
