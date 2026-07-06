import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { FormatClauseBindingsPage } from './FormatClauseBindingsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders format clause bindings with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<FormatClauseBindingsPage />);

  expect(screen.getByRole('heading', { name: '赛制条款绑定' })).toBeInTheDocument();
  expect(await screen.findByText('标准单打')).toBeInTheDocument();
  expect(screen.getByText('种类唯一')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建绑定/ }));

  await waitFor(() => expect(screen.getByText('新建赛制条款绑定')).toBeInTheDocument());
  expect(screen.getAllByText('战斗赛制').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('赛制条款').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(4);
});
