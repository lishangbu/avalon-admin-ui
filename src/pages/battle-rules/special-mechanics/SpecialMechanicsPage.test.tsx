import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { mockBattleRulePageRequests } from '../../../test/battle-rule-page-request-mocks';
import { renderWithQuery } from '../../../test/render-with-query';
import { SpecialMechanicsPage } from './SpecialMechanicsPage';

beforeEach(() => {
  mockBattleRulePageRequests();
});

it('renders special mechanics and opens the editor', async () => {
  const user = userEvent.setup();
  renderWithQuery(<SpecialMechanicsPage />);

  expect(screen.getByRole('heading', { name: '特殊机制' })).toBeInTheDocument();
  expect(await screen.findByText('临时属性强化')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建机制/ }));

  await waitFor(() => expect(screen.getByText('新建特殊机制')).toBeInTheDocument());
  expect(screen.getAllByText('编码').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('名称').length).toBeGreaterThanOrEqual(2);
});
