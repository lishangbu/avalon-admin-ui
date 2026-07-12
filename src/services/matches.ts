import type { components } from './generated/schema';
import { apiRequest } from './client';

export type MatchView = components['schemas']['MatchViewResponse'];
export type SubmitMatchTurn = components['schemas']['SubmitMatchTurnRequest'];
export type MatchTurn = components['schemas']['MatchTurnResponse'];

export const matchService = {
  current: () =>
    apiRequest<MatchView>('GET', '/api/player/matches/current', { requiresTrainerSession: true }),
  find: (matchId: string) =>
    apiRequest<MatchView>('GET', '/api/player/matches/{matchId}', {
      params: { path: { matchId } },
      requiresTrainerSession: true,
    }),
  submitTurn: (matchId: string, command: SubmitMatchTurn) =>
    apiRequest<MatchTurn>('POST', '/api/player/matches/{matchId}/turns', {
      params: { path: { matchId } },
      body: command,
      requiresTrainerSession: true,
    }),
  forfeit: (matchId: string, expectedRevision: number) =>
    apiRequest<MatchView>('POST', '/api/player/matches/{matchId}/forfeit', {
      params: { path: { matchId } },
      body: { expectedRevision },
      requiresTrainerSession: true,
    }),
};
