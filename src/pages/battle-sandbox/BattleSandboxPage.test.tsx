import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../services/battle-rule-options';
import { battleRulesServices } from '../../services/battle-rules';
import { battleSandboxService } from '../../services/battle-sandbox';
import { renderWithQuery } from '../../test/render-with-query';
import { BattleSandboxPage } from './BattleSandboxPage';

vi.mock('../../services/battle-sandbox', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/battle-sandbox')>();
  return {
    ...actual,
    battleSandboxService: {
      ...actual.battleSandboxService,
      resolveTurn: vi.fn(),
    },
  };
});

vi.mock('../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      battleFormats: {
        ...actual.battleRulesServices.battleFormats,
        list: vi.fn(),
      },
    },
  };
});

vi.mock('../../services/battle-rule-options', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/battle-rule-options')>();
  return {
    ...actual,
    battleRuleOptionServices: {
      ...actual.battleRuleOptionServices,
      creatures: vi.fn(),
      skills: vi.fn(),
      abilities: vi.fn(),
      items: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(battleRulesServices.battleFormats.list).mockResolvedValue({
    rows: [{ id: 1, code: 'standard-single', name: '标准单打' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.creatures).mockResolvedValue({
    rows: [
      { id: 1, code: 'bulbasaur', name: '妙蛙种子' },
      { id: 4, code: 'charmander', name: '小火龙' },
    ],
    totalRowCount: 2,
  });
  vi.mocked(battleRuleOptionServices.skills).mockResolvedValue({
    rows: [{ id: 1, code: 'pound', name: '拍击' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.abilities).mockResolvedValue({
    rows: [{ id: 65, code: 'overgrow', name: '茂盛' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.items).mockResolvedValue({
    rows: [{ id: 91, code: 'leftovers', name: '剩饭' }],
    totalRowCount: 1,
  });
  vi.mocked(battleSandboxService.resolveTurn).mockResolvedValue(createSandboxResponse(1, 96));
});

it('resolves default sandbox and continues with previous state snapshot', async () => {
  const user = userEvent.setup();
  const firstResponse = createSandboxResponse(1, 96);
  const secondResponse = createSandboxResponse(2, 82);
  vi.mocked(battleSandboxService.resolveTurn)
    .mockResolvedValueOnce(firstResponse)
    .mockResolvedValueOnce(secondResponse);
  renderWithQuery(<BattleSandboxPage />);

  expect(screen.getByRole('heading', { name: '战斗沙盒' })).toBeInTheDocument();
  expect(await screen.findByText('标准单打')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '结算回合' }));

  await waitFor(() => expect(battleSandboxService.resolveTurn).toHaveBeenCalledTimes(1));
  expect(battleSandboxService.resolveTurn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      formatCode: 'standard-single',
      randomSeed: 0,
      sides: expect.arrayContaining([
        expect.objectContaining({
          sideId: 'side-a',
          activeActorIds: ['side-a-1'],
          participants: expect.arrayContaining([
            expect.objectContaining({
              actorId: 'side-a-1',
              creatureId: 1,
              level: 50,
              skillIds: [1],
            }),
            expect.objectContaining({
              actorId: 'side-a-2',
              creatureId: 2,
              level: 50,
              skillIds: [1],
            }),
          ]),
        }),
      ]),
      actions: expect.arrayContaining([
        expect.objectContaining({
          type: 'USE_SKILL',
          actorId: 'side-a-1',
          skillId: 1,
          targetActorId: 'side-b-1',
        }),
      ]),
    }),
  );
  expect(vi.mocked(battleSandboxService.resolveTurn).mock.calls[0]?.[0]).not.toHaveProperty(
    'state',
  );
  expect(await screen.findAllByText('回合结算完成')).not.toHaveLength(0);
  expect(screen.getAllByText('妙蛙种子')).not.toHaveLength(0);
  expect(screen.getByText('造成伤害')).toBeInTheDocument();
  expect(screen.getByText('damage-roll')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '继续结算' }));

  await waitFor(() => expect(battleSandboxService.resolveTurn).toHaveBeenCalledTimes(2));
  expect(battleSandboxService.resolveTurn).toHaveBeenLastCalledWith(
    expect.objectContaining({ state: firstResponse.state }),
  );
  expect(await screen.findByText('第 2 回合已结算。')).toBeInTheDocument();
});

function createSandboxResponse(turnNumber: number, targetHp: number) {
  const events = [
    { type: 'BattleStarted', turnNumber: 0, message: '战斗开始。', payload: {} },
    {
      type: 'DamageApplied',
      turnNumber,
      message: `side-b-1 受到 ${110 - targetHp} 点伤害。`,
      payload: {},
    },
  ];
  return {
    resolved: true,
    turnNumber,
    sides: [
      {
        sideId: 'side-a',
        activeActorIds: ['side-a-1'],
        participants: [
          {
            actorId: 'side-a-1',
            creatureId: 1,
            active: true,
            level: 50,
            currentHp: 120,
            maxHp: 120,
            statStages: {},
            skillSlots: [{ skillId: 1, name: '拍击', remainingPp: 34, maxPp: 35 }],
          },
        ],
      },
      {
        sideId: 'side-b',
        activeActorIds: ['side-b-1'],
        participants: [
          {
            actorId: 'side-b-1',
            creatureId: 4,
            active: true,
            level: 50,
            currentHp: targetHp,
            maxHp: 110,
            statStages: {},
            skillSlots: [{ skillId: 1, name: '拍击', remainingPp: 35, maxPp: 35 }],
          },
        ],
      },
    ],
    events,
    violations: [],
    randomTrace: [{ sequence: 1, bound: 100, reason: 'damage-roll', value: 15 }],
    state: {
      turnNumber,
      environment: { weather: 'NONE', terrain: 'NONE' },
      sides: [
        createStateSide('side-a', 'side-a-1', 120, 34),
        createStateSide('side-b', 'side-b-1', targetHp, 35),
      ],
      events,
    },
  };
}

function createStateSide(sideId: string, actorId: string, currentHp: number, remainingPp: number) {
  return {
    sideId,
    activeActorIds: [actorId],
    participants: [
      {
        actorId,
        currentHp,
        elementIds: [1],
        grounded: true,
        statStages: {},
        skillSlots: [{ skillId: 1, remainingPp }],
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
        lockedMoveTurnsRemaining: 0,
        lockedMoveConfusesOnEnd: false,
        substituteHp: 0,
      },
    ],
    damageReductions: [],
    speedModifiers: [],
    entryHazards: [],
  };
}
