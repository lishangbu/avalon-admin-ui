import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { FormatClausesPage } from './FormatClausesPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders format clauses and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<FormatClausesPage />);

  expect(screen.getByRole('heading', { name: '赛制条款' })).toBeInTheDocument();
  expect(await screen.findByText('种类唯一')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建条款/ }));

  await waitFor(() => expect(screen.getByText('新建赛制条款')).toBeInTheDocument());
  expect(screen.getAllByText('条款类型').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
});
