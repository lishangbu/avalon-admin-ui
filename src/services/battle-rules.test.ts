import { expect, it, vi } from 'vitest';
import { createBattleRulesServices } from './battle-rules';

it('calls explicit battle rule resource endpoints', async () => {
  const request = vi.fn().mockResolvedValue({});
  const services = createBattleRulesServices(request);

  await services.skillRules.list({ page: 0, size: 20, skillId: 85, q: 'standard' });
  await services.skillRules.create({
    skillId: 85,
    effectPolicy: 'standard-damage',
    targetPolicy: 'selected-target',
    hitPolicy: 'standard-hit',
    damagePolicy: 'standard-damage',
    makesContact: false,
    affectedByProtect: true,
    soundBased: false,
    powderBased: false,
    punchBased: false,
    slicingBased: false,
    enabled: true,
    sortOrder: 10,
  });
  await services.skillRules.update(1, {
    skillId: 85,
    effectPolicy: 'standard-damage',
    targetPolicy: 'selected-target',
    hitPolicy: 'standard-hit',
    damagePolicy: 'standard-damage',
    makesContact: false,
    affectedByProtect: true,
    soundBased: false,
    powderBased: false,
    punchBased: false,
    slicingBased: false,
    enabled: true,
    sortOrder: 20,
  });
  await services.skillRules.remove(1);

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-rules/skill-rules', {
    params: { query: { page: 0, size: 20, skillId: 85, q: 'standard' } },
  });
  expect(request).toHaveBeenNthCalledWith(
    2,
    'POST',
    '/api/battle-rules/skill-rules',
    expect.objectContaining({ body: expect.objectContaining({ skillId: 85 }) }),
  );
  expect(request).toHaveBeenNthCalledWith(
    3,
    'PUT',
    '/api/battle-rules/skill-rules/{id}',
    expect.objectContaining({
      params: { path: { id: 1 } },
      body: expect.objectContaining({ sortOrder: 20 }),
    }),
  );
  expect(request).toHaveBeenNthCalledWith(4, 'DELETE', '/api/battle-rules/skill-rules/{id}', {
    params: { path: { id: 1 } },
  });
});

it('uses independent endpoints for effect rule resources', async () => {
  const request = vi.fn().mockResolvedValue({});
  const services = createBattleRulesServices(request);

  await services.abilityRules.list({
    page: 0,
    size: 20,
    abilityId: 65,
    triggerTiming: 'BEFORE_DAMAGE',
  });
  await services.itemRules.list({
    page: 0,
    size: 20,
    itemId: 211,
    triggerTiming: 'HELD_END_TURN',
  });
  await services.skillStatusEffects.list({ page: 0, size: 20, skillRuleId: 1 });
  await services.skillStatStageEffects.list({ page: 0, size: 20, statId: 2 });
  await services.skillGlobalFieldEffects.list({ page: 0, size: 20, fieldRuleId: 5 });

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-rules/ability-rules', {
    params: {
      query: { page: 0, size: 20, abilityId: 65, triggerTiming: 'BEFORE_DAMAGE' },
    },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/battle-rules/item-rules', {
    params: {
      query: { page: 0, size: 20, itemId: 211, triggerTiming: 'HELD_END_TURN' },
    },
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/battle-rules/skill-status-effects', {
    params: { query: { page: 0, size: 20, skillRuleId: 1 } },
  });
  expect(request).toHaveBeenNthCalledWith(4, 'GET', '/api/battle-rules/skill-stat-stage-effects', {
    params: { query: { page: 0, size: 20, statId: 2 } },
  });
  expect(request).toHaveBeenNthCalledWith(
    5,
    'GET',
    '/api/battle-rules/skill-global-field-effects',
    {
      params: { query: { page: 0, size: 20, fieldRuleId: 5 } },
    },
  );
});

it('uses explicit runtime snapshot endpoints', async () => {
  const request = vi.fn().mockResolvedValue({});
  const services = createBattleRulesServices(request);

  await services.runtime.getByFormatCode('official-double');
  await services.runtime.validatePreparation({
    formatCode: 'official-double',
    sides: [
      {
        sideId: 'side-a',
        activeActorIds: ['a-1', 'a-2'],
        participants: [
          {
            actorId: 'a-1',
            creatureId: 1,
            level: 50,
            skillIds: [1, 2, 3, 4],
          },
        ],
      },
    ],
  });

  expect(request).toHaveBeenNthCalledWith(
    1,
    'GET',
    '/api/battle-rules/runtime/formats/{formatCode}',
    {
      params: { path: { formatCode: 'official-double' } },
    },
  );
  expect(request).toHaveBeenNthCalledWith(
    2,
    'POST',
    '/api/battle-rules/runtime/preparation-validation',
    expect.objectContaining({
      body: expect.objectContaining({ formatCode: 'official-double' }),
    }),
  );
});

it('uses independent coverage report endpoint', async () => {
  const request = vi.fn().mockResolvedValue({});
  const services = createBattleRulesServices(request);

  await services.coverage.get();

  expect(request).toHaveBeenCalledWith('GET', '/api/battle-rules/coverage');
});

it('uses independent fixture management endpoints', async () => {
  const request = vi.fn().mockResolvedValue({});
  const services = createBattleRulesServices(request);

  await services.fixtures.list({
    page: 0,
    size: 20,
    q: 'burn',
    category: 'STATUS',
    enabled: true,
  });
  await services.fixtureSources.list({ page: 0, size: 20, fixtureId: 3 });
  await services.testRuns.list({ page: 0, size: 20, fixtureId: 3, runStatus: 'PASSED' });

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-rules/fixtures', {
    params: {
      query: { page: 0, size: 20, q: 'burn', category: 'STATUS', enabled: true },
    },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/battle-rules/fixture-sources', {
    params: { query: { page: 0, size: 20, fixtureId: 3 } },
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/battle-rules/test-runs', {
    params: { query: { page: 0, size: 20, fixtureId: 3, runStatus: 'PASSED' } },
  });
});
