import type { components } from './generated/schema';
import { apiRequest } from './client';

export type TrainerSession = components['schemas']['TrainerSessionResponse'];

export const trainerSessionService = {
  enter: (trainerId: string) =>
    apiRequest<TrainerSession>('POST', '/api/player/trainer-session', { body: { trainerId } }),
  current: () =>
    apiRequest<TrainerSession>('GET', '/api/player/trainer-session', {
      requiresTrainerSession: true,
    }),
  heartbeat: () =>
    apiRequest<void>('POST', '/api/player/trainer-session/heartbeat', {
      requiresTrainerSession: true,
      allowEmptyResponse: true,
    }),
  leave: () =>
    apiRequest<void>('DELETE', '/api/player/trainer-session', {
      requiresTrainerSession: true,
      allowEmptyResponse: true,
    }),
};
