import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { FormatSpecialMechanicsPage } from './FormatSpecialMechanicsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders format special mechanics with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<FormatSpecialMechanicsPage />);

  expect(screen.getByRole('heading', { name: '赛制特殊机制' })).toBeInTheDocument();
  expect(await screen.findByText('标准单打')).toBeInTheDocument();
  expect(screen.getByText('临时属性强化')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建绑定/ }));

  await waitFor(() => expect(screen.getByText('新建赛制特殊机制')).toBeInTheDocument());
  expect(screen.getAllByText('战斗赛制').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('特殊机制').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(4);
});
