import type { components } from './generated/schema';
import { apiRequest } from './client';

export type MatchView = components['schemas']['MatchViewResponse'];
export type SubmitMatchTurn = components['schemas']['SubmitMatchTurnRequest'];
export type MatchTurn = components['schemas']['MatchTurnResponse'];
export type MatchHistory = components['schemas']['MatchHistoryResponse'];

export const matchService = {
  current: () =>
    apiRequest<MatchView>('GET', '/api/player/matches/current', { requiresTrainerSession: true }),
  find: (matchId: string) =>
    apiRequest<MatchView>('GET', '/api/player/matches/{matchId}', {
      params: { path: { matchId } },
      requiresTrainerSession: true,
    }),
  history: (beforeMatchId?: string, limit = 20) =>
    apiRequest<MatchHistory[]>('GET', '/api/player/matches/history', {
      params: { query: { beforeMatchId, limit } },
      requiresTrainerSession: true,
    }),
  historyDetail: (matchId: string) =>
    apiRequest<MatchView>('GET', '/api/player/matches/history/{matchId}', {
      params: { path: { matchId } },
      requiresTrainerSession: true,
    }),
  archivedHistory: (trainerId: string, beforeMatchId?: string, limit = 20) =>
    apiRequest<MatchHistory[]>('GET', '/api/player/trainers/{trainerId}/match-history', {
      params: { path: { trainerId }, query: { beforeMatchId, limit } },
    }),
  archivedHistoryDetail: (trainerId: string, matchId: string) =>
    apiRequest<MatchView>('GET', '/api/player/trainers/{trainerId}/match-history/{matchId}', {
      params: { path: { trainerId, matchId } },
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
