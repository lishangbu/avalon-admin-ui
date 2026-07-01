import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { ActionValidationPage } from './ActionValidationPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      battleFormats: {
        ...actual.battleRulesServices.battleFormats,
        list: vi.fn(),
      },
      runtime: {
        ...actual.battleRulesServices.runtime,
        validateActions: vi.fn(),
      },
    },
  };
});

vi.mock('../../../services/battle-rule-options', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rule-options')>();
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
  vi.mocked(battleRulesServices.battleFormats.list).mockResolvedValue({
    rows: [{ id: 1, code: 'official-double', name: '官方双打' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.creatures).mockResolvedValue({
    rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.skills).mockResolvedValue({
    rows: [
      { id: 1, code: 'tackle', name: '撞击' },
      { id: 2, code: 'growl', name: '叫声' },
      { id: 3, code: 'vine-whip', name: '藤鞭' },
      { id: 4, code: 'sleep-powder', name: '催眠粉' },
    ],
    totalRowCount: 4,
  });
  vi.mocked(battleRuleOptionServices.abilities).mockResolvedValue({
    rows: [{ id: 65, code: 'overgrow', name: '茂盛' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.items).mockResolvedValue({
    rows: [{ id: 91, code: 'leftovers', name: '剩饭' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRulesServices.runtime.validateActions).mockResolvedValue({
    valid: false,
    violations: [
      {
        code: 'skill-not-known',
        actorId: 'side-a-1',
        targetActorId: 'side-b-1',
        resourceId: 99,
        message: '行动成员没有掌握该技能',
      },
    ],
  });
});

it('renders action validation options and backend violations', async () => {
  const user = userEvent.setup();
  renderWithQuery(<ActionValidationPage />);

  expect(screen.getByRole('heading', { name: '行动校验' })).toBeInTheDocument();
  expect(await screen.findByText('官方双打（official-double）')).toBeInTheDocument();
  expect(screen.getAllByText('撞击（tackle）').length).toBeGreaterThan(0);

  await user.click(screen.getByRole('button', { name: '开始校验' }));

  await waitFor(() =>
    expect(battleRulesServices.runtime.validateActions).toHaveBeenCalledWith(
      expect.objectContaining({
        formatCode: 'official-double',
        actions: expect.arrayContaining([
          expect.objectContaining({
            type: 'USE_SKILL',
            actorId: 'side-a-1',
            skillId: 1,
            targetActorId: 'side-b-1',
          }),
        ]),
      }),
    ),
  );
  expect(await screen.findByText('行动校验未通过')).toBeInTheDocument();
  expect(screen.getByText('skill-not-known')).toBeInTheDocument();
  expect(screen.getByText('行动成员没有掌握该技能')).toBeInTheDocument();
});
