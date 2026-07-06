import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { BattleFormatsPage } from './BattleFormatsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders battle formats and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<BattleFormatsPage />);

  expect(screen.getByRole('heading', { name: '战斗赛制' })).toBeInTheDocument();
  expect(await screen.findByText('标准单打')).toBeInTheDocument();
  expect(screen.getByText('单打')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建赛制/ }));

  await waitFor(() => expect(screen.getByText('新建战斗赛制')).toBeInTheDocument());
  expect(screen.getAllByText('站位模式').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
});
