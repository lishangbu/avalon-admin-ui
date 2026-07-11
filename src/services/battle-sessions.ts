import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type BattleSessionCreateRequest = components['schemas']['BattleSessionCreateRequest'];
export type BattleSessionResponse = components['schemas']['BattleSessionResponse'];
export type BattleSessionSummaryResponse = components['schemas']['BattleSessionSummaryResponse'];
export type BattleSessionSummaryPage = components['schemas']['PageBattleSessionSummaryResponse'];
export type BattleSessionTurnCommandRequest =
  components['schemas']['BattleSessionTurnCommandRequest'];
export type BattleSessionTurnRecordResponse =
  components['schemas']['BattleSessionTurnRecordResponse'];
export type BattleSessionTurnResponse = components['schemas']['BattleSessionTurnResponse'];
export type BattleSessionTurnPage = components['schemas']['PageBattleSessionTurnRecordResponse'];
export type BattleSessionTerminationRequest =
  components['schemas']['BattleSessionTerminationRequest'];
export type BattleSessionStatus = BattleSessionResponse['status'];

export interface BattleSessionListQuery {
  status?: BattleSessionStatus;
  formatCode?: string;
  page?: number;
  size?: number;
}

export interface BattleSessionTurnListQuery {
  page?: number;
  size?: number;
}

/** 访问后端权威 Battle Session 临时资源。 */
export function createBattleSessionService(request: ApiRequest = apiRequest) {
  return {
    list: (query: BattleSessionListQuery = {}) =>
      request<BattleSessionSummaryPage>('GET', '/api/battle-sessions', {
        params: { query },
      }),
    create: (body: BattleSessionCreateRequest) =>
      request<BattleSessionResponse>('POST', '/api/battle-sessions', { body }),
    get: (sessionId: string) =>
      request<BattleSessionResponse>('GET', `/api/battle-sessions/${sessionId}`),
    listTurns: (sessionId: string, query: BattleSessionTurnListQuery = {}) =>
      request<BattleSessionTurnPage>('GET', `/api/battle-sessions/${sessionId}/turns`, {
        params: { query },
      }),
    submitTurn: (sessionId: string, body: BattleSessionTurnCommandRequest) =>
      request<BattleSessionTurnResponse>('POST', `/api/battle-sessions/${sessionId}/turns`, {
        body,
      }),
    terminate: (sessionId: string, body: BattleSessionTerminationRequest) =>
      request<BattleSessionResponse>('POST', `/api/battle-sessions/${sessionId}/termination`, {
        body,
      }),
  };
}

export const battleSessionService = createBattleSessionService();
