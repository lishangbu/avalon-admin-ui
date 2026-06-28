import { createGameDataResourceService, type ApiRequest } from './shared';

export function createGenderEvolutionRequirementsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/gender-evolution-requirements', request);
}

export const genderEvolutionRequirementsGameDataService =
  createGenderEvolutionRequirementsGameDataService();
