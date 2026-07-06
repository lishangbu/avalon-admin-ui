import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { SkillStatusEffectsPage } from './SkillStatusEffectsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders skill status effects with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<SkillStatusEffectsPage />);

  expect(screen.getByRole('heading', { name: '技能状态效果' })).toBeInTheDocument();
  expect(await screen.findByText('十万伏特 / 标准伤害')).toBeInTheDocument();
  expect(screen.getByText('灼伤')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建效果/ }));

  await waitFor(() => expect(screen.getByText('新建技能状态效果')).toBeInTheDocument());
  expect(screen.getAllByText('技能规则').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('状态规则').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(4);
});
