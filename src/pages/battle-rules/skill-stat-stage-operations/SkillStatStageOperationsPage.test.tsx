import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { SkillStatStageOperationsPage } from './SkillStatStageOperationsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders skill stat stage operations with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<SkillStatStageOperationsPage />);

  expect(screen.getByRole('heading', { name: '技能能力阶级操作' })).toBeInTheDocument();
  expect(await screen.findByText('十万伏特 / 标准伤害')).toBeInTheDocument();
  expect(screen.getByText('攻击')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建操作/ }));

  await waitFor(() => expect(screen.getByText('新建技能能力阶级操作')).toBeInTheDocument());
  expect(screen.getAllByText('技能规则').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('能力项').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(6);
});
