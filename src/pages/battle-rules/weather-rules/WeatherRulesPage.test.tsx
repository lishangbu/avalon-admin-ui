import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { WeatherRulesPage } from './WeatherRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      weatherRules: {
        ...actual.battleRulesServices.weatherRules,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.weatherRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'rain',
        name: '下雨',
        effectPolicy: 'weather-rain',
        defaultDurationTurns: 5,
        enabled: true,
        sortOrder: 10,
        description: '测试天气规则中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders weather rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<WeatherRulesPage />);

  expect(screen.getByRole('heading', { name: '天气规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.weatherRules.list).toHaveBeenCalled());

  expect((await screen.findAllByText('下雨')).length).toBeGreaterThanOrEqual(2);

  await user.click(screen.getByRole('button', { name: /新建天气/ }));

  expect(await screen.findByText('新建天气规则')).toBeInTheDocument();
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
});
