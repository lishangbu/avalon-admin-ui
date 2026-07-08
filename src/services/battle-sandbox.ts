import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type BattleSandboxTurnRequest = components['schemas']['BattleSandboxTurnRequest'];
export type BattleSandboxTurnResponse = components['schemas']['BattleSandboxTurnResponse'];
export type BattleSandboxStateSnapshot = components['schemas']['BattleSandboxStateSnapshot'];
export type BattleSandboxTurnRecord = components['schemas']['BattleSandboxStateTurnRecord'];
export type BattleSandboxSide = components['schemas']['BattleSandboxTurnSide'];
export type BattleSandboxParticipant = components['schemas']['BattleSandboxTurnParticipant'];
export type BattleSandboxEvent = components['schemas']['BattleSandboxTurnEvent'];
export type BattleSandboxRandomTrace = components['schemas']['BattleSandboxTurnRandomTrace'];
export type BattleActionViolationResponse = components['schemas']['BattleActionViolationResponse'];

export interface BattleSandboxReplayRequest {
  title: string;
  formatCode: string;
  responseJson: string;
}

export interface BattleSandboxReplaySummaryResponse {
  id: number;
  title: string;
  formatCode: string;
  turnNumber: number;
  resolved: boolean;
  resultSummary?: string;
  savedAt: string;
}

export interface BattleSandboxReplayResponse extends BattleSandboxReplaySummaryResponse {
  responseJson: string;
}

export interface BattleSandboxReplayPage {
  rows?: BattleSandboxReplaySummaryResponse[];
  totalRowCount?: number;
  totalPageCount?: number;
  page?: number;
  size?: number;
}

export function createBattleSandboxService(request: ApiRequest = apiRequest) {
  return {
    resolveTurn: (body: BattleSandboxTurnRequest) =>
      request<BattleSandboxTurnResponse>('POST', '/api/battle-sandbox/turn', { body }),
    listReplays: (query: { page?: number; size?: number; q?: string } = {}) =>
      request<BattleSandboxReplayPage>('GET', '/api/battle-sandbox/replays', {
        params: { query },
      }),
    getReplay: (id: number) =>
      request<BattleSandboxReplayResponse>('GET', `/api/battle-sandbox/replays/${id}`),
    createReplay: (body: BattleSandboxReplayRequest) =>
      request<BattleSandboxReplayResponse>('POST', '/api/battle-sandbox/replays', { body }),
    deleteReplay: (id: number) =>
      request<void>('DELETE', `/api/battle-sandbox/replays/${id}`, { allowEmptyResponse: true }),
  };
}

export const battleSandboxService = createBattleSandboxService();
