import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';

export type BattleSandboxTurnRequest = components['schemas']['BattleSandboxTurnRequest'];
export type BattleSandboxTurnResponse = components['schemas']['BattleSandboxTurnResponse'];
export type BattleSandboxStateSnapshot = components['schemas']['BattleSandboxStateSnapshot'];
export type BattleSandboxSide = components['schemas']['BattleSandboxTurnSide'];
export type BattleSandboxParticipant = components['schemas']['BattleSandboxTurnParticipant'];
export type BattleSandboxEvent = components['schemas']['BattleSandboxTurnEvent'];
export type BattleSandboxRandomTrace = components['schemas']['BattleSandboxTurnRandomTrace'];
export type BattleActionViolationResponse = components['schemas']['BattleActionViolationResponse'];

export function createBattleSandboxService(request: ApiRequest = apiRequest) {
  return {
    resolveTurn: (body: BattleSandboxTurnRequest) =>
      request<BattleSandboxTurnResponse>('POST', '/api/battle-sandbox/turn', { body }),
  };
}

export const battleSandboxService = createBattleSandboxService();
