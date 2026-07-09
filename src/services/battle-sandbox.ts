import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type BattleSandboxTurnRequest = components['schemas']['BattleSandboxTurnRequest'];
export type BattleSandboxTurnResponse = components['schemas']['BattleSandboxTurnResponse'];
export type BattleSandboxStateSnapshot = components['schemas']['BattleSandboxStateSnapshot'];
export type BattleSandboxTurnRecord = components['schemas']['BattleSandboxStateTurnRecord'];
export type BattleSandboxSide = components['schemas']['BattleSandboxTurnSide'];
export type BattleSandboxParticipant = components['schemas']['BattleSandboxTurnParticipant'];
export type BattleSandboxEvent = components['schemas']['BattleSandboxTurnEvent'];
export type BattleSandboxRuleHitSummary = components['schemas']['BattleSandboxRuleHitSummary'];
export type BattleSandboxRandomTrace = components['schemas']['BattleSandboxTurnRandomTrace'];
export type BattleActionViolationResponse = components['schemas']['BattleActionViolationResponse'];
export type BattleSandboxReplayRequest = components['schemas']['BattleSandboxReplayRequest'];
export type BattleSandboxReplaySummaryResponse =
  components['schemas']['BattleSandboxReplaySummaryResponse'];
export type BattleSandboxReplayResponse = components['schemas']['BattleSandboxReplayResponse'];
export type BattleSandboxReplayValidationResponse =
  components['schemas']['BattleSandboxReplayValidationResponse'];
export type BattleSandboxReplayPage =
  components['schemas']['PageBattleSandboxReplaySummaryResponse'];

export function createBattleSandboxService(request: ApiRequest = apiRequest) {
  return {
    resolveTurn: (body: BattleSandboxTurnRequest) =>
      request<BattleSandboxTurnResponse>('POST', '/api/battle-sandbox/turn', { body }),
    listReplays: (query: { page?: number; size?: number; q?: string } = {}) =>
      request<BattleSandboxReplayPage>('GET', '/api/battle-sandbox/replays', {
        params: { query },
      }),
    getReplay: (id: string) =>
      request<BattleSandboxReplayResponse>('GET', `/api/battle-sandbox/replays/${id}`),
    validateReplay: (id: string) =>
      request<BattleSandboxReplayValidationResponse>(
        'POST',
        `/api/battle-sandbox/replays/${id}/validation`,
      ),
    createReplay: (body: BattleSandboxReplayRequest) =>
      request<BattleSandboxReplayResponse>('POST', '/api/battle-sandbox/replays', { body }),
    deleteReplay: (id: string) =>
      request<void>('DELETE', `/api/battle-sandbox/replays/${id}`, { allowEmptyResponse: true }),
  };
}

export const battleSandboxService = createBattleSandboxService();
