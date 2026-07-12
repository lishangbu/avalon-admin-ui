import type { components } from './generated/schema';
import { apiRequest } from './client';

export type TrainerTeam = components['schemas']['TrainerTeamResponse'];
export type SaveTrainerTeam = components['schemas']['SaveTrainerTeamRequest'];
export type SaveTrainerTeamMember = components['schemas']['SaveTrainerTeamMemberRequest'];

export const trainerTeamService = {
  get: () =>
    apiRequest<TrainerTeam>('GET', '/api/player/trainer-team', {
      requiresTrainerSession: true,
    }),
  save: (command: SaveTrainerTeam) =>
    apiRequest<TrainerTeam>('PUT', '/api/player/trainer-team', {
      body: command,
      requiresTrainerSession: true,
    }),
};
