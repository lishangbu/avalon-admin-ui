import type { components } from './generated/schema';
import { apiRequest } from './client';

export type Challenge = components['schemas']['ChallengeResponse'];
export type CreateChallenge = Required<components['schemas']['CreateChallengeRequest']>;
export type PlayerMatch = components['schemas']['MatchResponse'];

export const challengeService = {
  list: () =>
    apiRequest<Challenge[]>('GET', '/api/player/challenges', { requiresTrainerSession: true }),
  find: (challengeId: string) =>
    apiRequest<Challenge>('GET', '/api/player/challenges/{challengeId}', {
      params: { path: { challengeId } },
      requiresTrainerSession: true,
    }),
  create: (command: CreateChallenge) =>
    apiRequest<Challenge>('POST', '/api/player/challenges', {
      body: command,
      requiresTrainerSession: true,
    }),
  reject: (challengeId: string, expectedRevision: number) =>
    apiRequest<Challenge>('POST', '/api/player/challenges/{challengeId}/reject', {
      params: { path: { challengeId } },
      body: { expectedRevision },
      requiresTrainerSession: true,
    }),
  accept: (challengeId: string, expectedRevision: number, leadPosition: number) =>
    apiRequest<PlayerMatch>('POST', '/api/player/challenges/{challengeId}/accept', {
      params: { path: { challengeId } },
      body: { expectedRevision, leadPosition },
      requiresTrainerSession: true,
    }),
  withdraw: (challengeId: string, expectedRevision: number) =>
    apiRequest<Challenge>('POST', '/api/player/challenges/{challengeId}/withdraw', {
      params: { path: { challengeId } },
      body: { expectedRevision },
      requiresTrainerSession: true,
    }),
};
