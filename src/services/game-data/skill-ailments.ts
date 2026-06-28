import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSkillAilmentsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/skill-ailments', request);
}

export const skillAilmentsGameDataService = createSkillAilmentsGameDataService();
