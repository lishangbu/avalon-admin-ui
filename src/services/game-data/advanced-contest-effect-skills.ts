import { createGameDataResourceService, type ApiRequest } from './shared';

export function createAdvancedContestEffectSkillsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/advanced-contest-effect-skills', request);
}

export const advancedContestEffectSkillsGameDataService =
  createAdvancedContestEffectSkillsGameDataService();
