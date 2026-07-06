import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { FormatRestrictionsPage } from './FormatRestrictionsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders format restrictions with readable references and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<FormatRestrictionsPage />);

  expect(screen.getByRole('heading', { name: '赛制限制' })).toBeInTheDocument();
  expect(await screen.findByText('等级上限')).toBeInTheDocument();
  expect(screen.getByText('标准单打')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建限制/ }));

  await waitFor(() => expect(screen.getByText('新建赛制限制')).toBeInTheDocument());
  expect(screen.getAllByText('战斗赛制').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(3);
});
