import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { SkillTerrainPowerModifiersPage } from './SkillTerrainPowerModifiersPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders skill terrain power modifiers with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<SkillTerrainPowerModifiersPage />);

  expect(screen.getByRole('heading', { name: '技能场地威力' })).toBeInTheDocument();
  expect(await screen.findByText('十万伏特 / 标准伤害')).toBeInTheDocument();
  expect(screen.getByText('电气场地')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建倍率/ }));

  await waitFor(() => expect(screen.getByText('新建技能场地威力倍率')).toBeInTheDocument());
  expect(screen.getAllByText('技能规则').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('场地规则').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(4);
});
