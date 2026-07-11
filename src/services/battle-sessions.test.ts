import { expect, it, vi } from 'vitest';
import {
  createBattleSessionService,
  type BattleSessionCreateRequest,
  type BattleSessionTerminationRequest,
  type BattleSessionTurnCommandRequest,
} from './battle-sessions';

it('uses the battle session collection and detail endpoints', async () => {
  const request = vi.fn().mockResolvedValue({ rows: [], totalRowCount: 0, totalPageCount: 0 });
  const service = createBattleSessionService(request);
  const createBody: BattleSessionCreateRequest = {
    formatCode: 'standard-single',
    sides: [],
  };

  await service.list({ status: 'ACTIVE', formatCode: 'standard-single', page: 1, size: 20 });
  await service.create(createBody);
  await service.get('session-uuid');

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-sessions', {
    params: {
      query: { status: 'ACTIVE', formatCode: 'standard-single', page: 1, size: 20 },
    },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'POST', '/api/battle-sessions', {
    body: createBody,
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/battle-sessions/session-uuid');
});

it('uses turn and termination command endpoints', async () => {
  const request = vi.fn().mockResolvedValue({ rows: [], totalRowCount: 0, totalPageCount: 0 });
  const service = createBattleSessionService(request);
  const turnBody: BattleSessionTurnCommandRequest = {
    commandId: 'turn-command-uuid',
    expectedRevision: 4,
    actions: [],
  };
  const terminationBody: BattleSessionTerminationRequest = {
    commandId: 'termination-command-uuid',
    expectedRevision: 4,
    reason: '管理员终止',
  };

  await service.listTurns('session-uuid', { page: 0, size: 20 });
  await service.submitTurn('session-uuid', turnBody);
  await service.terminate('session-uuid', terminationBody);

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-sessions/session-uuid/turns', {
    params: { query: { page: 0, size: 20 } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'POST', '/api/battle-sessions/session-uuid/turns', {
    body: turnBody,
  });
  expect(request).toHaveBeenNthCalledWith(
    3,
    'POST',
    '/api/battle-sessions/session-uuid/termination',
    { body: terminationBody },
  );
});
