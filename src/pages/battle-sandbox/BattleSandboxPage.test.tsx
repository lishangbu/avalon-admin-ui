import { describe, expect, it } from 'vitest';
import type { BattleSandboxStateSnapshot } from '../../services/battle-sandbox';
import { createDefaultValues, toSandboxRequest } from './battle-sandbox-request';

describe('BattleSandboxPage request mapping', () => {
  it('builds the default first-turn request without a previous state snapshot', () => {
    const request = toSandboxRequest(createDefaultValues());

    expect(request).toEqual(
      expect.objectContaining({
        formatCode: 'standard-single',
        randomSeed: 0,
      }),
    );
    expect(request).not.toHaveProperty('state');
    expect(request.sides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sideId: 'side-a',
          activeActorIds: ['side-a-1'],
          participants: expect.arrayContaining([
            expect.objectContaining({
              actorId: 'side-a-1',
              creatureId: '1',
              level: 50,
              skillIds: ['1'],
              individualValues: expect.objectContaining({ hp: 31, attack: 31, speed: 31 }),
              effortValues: expect.objectContaining({ hp: 0, attack: 0, speed: 0 }),
            }),
            expect.objectContaining({
              actorId: 'side-a-2',
              creatureId: '2',
              level: 50,
              skillIds: ['1'],
            }),
          ]),
        }),
      ]),
    );
    expect(request.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'USE_SKILL',
          actorId: 'side-a-1',
          skillId: '1',
          targetActorId: 'side-b-1',
        }),
      ]),
    );
  });

  it('carries the resolved state snapshot only when continuing an unfinished battle', () => {
    const state = createStateSnapshot();
    const request = toSandboxRequest(createDefaultValues(), state);

    expect(request.state).toBe(state);
  });

  it('trims free-text identifiers and omits skill id for switch actions', () => {
    const values = createDefaultValues();
    values.formatCode = ' standard-single ';
    values.sides = [
      {
        sideId: ' side-a ',
        activeActorIds: [' side-a-1 ', ''],
        participants: [
          {
            actorId: ' side-a-1 ',
            creatureId: '1',
            level: 50,
            skillIds: ['1', ''],
          },
        ],
      },
    ];
    values.actions = [
      {
        type: ' SWITCH_PARTICIPANT ',
        actorId: ' side-a-1 ',
        skillId: '1',
        targetActorId: ' side-a-2 ',
      },
    ];

    const request = toSandboxRequest(values);

    expect(request.formatCode).toBe('standard-single');
    expect(request.sides[0]).toEqual(
      expect.objectContaining({
        sideId: 'side-a',
        activeActorIds: ['side-a-1'],
      }),
    );
    expect(request.sides[0]?.participants[0]).toEqual(
      expect.objectContaining({
        actorId: 'side-a-1',
        skillIds: ['1'],
      }),
    );
    expect(request.actions[0]).toEqual({
      type: 'SWITCH_PARTICIPANT',
      actorId: 'side-a-1',
      skillId: undefined,
      targetActorId: 'side-a-2',
    });
  });
});

function createStateSnapshot(): BattleSandboxStateSnapshot {
  /*
   * 页面测试只关心 state 是否被原样透传给下一回合请求，不重新验证后端战斗状态的每个字段。
   * 因此这里保留一份最小但结构完整的快照：队伍、成员、环境、事件和已结算回合都存在，
   * 可以防止前端把 state 丢掉、复制一份新对象，或在继续结算时退回首回合请求。
   */
  return {
    turnNumber: 1,
    environment: { weather: 'NONE', terrain: 'NONE' },
    sides: [
      {
        sideId: 'side-a',
        activeActorIds: ['side-a-1'],
        participants: [
          {
            actorId: 'side-a-1',
            currentHp: 100,
            elementIds: ['1'],
            grounded: true,
            statStages: {},
            skillSlots: [{ skillId: '1', remainingPp: 34 }],
            weightReduction: 0,
            protectionChain: 0,
            badPoisonCounter: 0,
            sleepTurnsRemaining: 0,
            chargingTurnsRemaining: 0,
            rechargeTurnsRemaining: 0,
            flinched: false,
            confusionTurnsRemaining: 0,
            healBlockTurnsRemaining: 0,
            tauntTurnsRemaining: 0,
            disabledSkillTurnsRemaining: 0,
            tormented: false,
            bindingTurnsRemaining: 0,
            accuracyLockTurnsRemaining: 0,
            lockedMoveTurnsRemaining: 0,
            lockedMoveConfusesOnEnd: false,
            substituteHp: 0,
          },
        ],
        damageReductions: [],
        speedModifiers: [],
        entryHazards: [],
      },
    ],
    events: [],
    turns: [],
  };
}
