import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { LayoutSettingsProvider, useLayoutSettings } from './LayoutSettingsProvider';

beforeEach(() => {
  localStorage.clear();
  document.body.style.filter = '';
  delete document.body.dataset.avalonOriginalFilter;
});

it('loads persisted layout settings', () => {
  localStorage.setItem('avalon-admin-layout-settings', JSON.stringify({ layout: 'top' }));

  render(
    <LayoutSettingsProvider>
      <SettingsProbe />
    </LayoutSettingsProvider>,
  );

  expect(screen.getByTestId('layout')).toHaveTextContent('top');
});

it('updates settings and applies color weak mode', async () => {
  const user = userEvent.setup();

  render(
    <LayoutSettingsProvider>
      <SettingsProbe />
    </LayoutSettingsProvider>,
  );

  await user.click(screen.getByRole('button', { name: '启用色弱' }));
  expect(screen.getByTestId('color-weak')).toHaveTextContent('true');
  expect(document.body.style.filter).toBe('invert(80%)');

  await user.click(screen.getByRole('button', { name: '关闭色弱' }));
  expect(screen.getByTestId('color-weak')).toHaveTextContent('false');
  expect(document.body.style.filter).toBe('');
});

function SettingsProbe() {
  const { settings, updateSettings } = useLayoutSettings();

  return (
    <div>
      <span data-testid="layout">{settings.layout}</span>
      <span data-testid="color-weak">{String(settings.colorWeak)}</span>
      <button type="button" onClick={() => updateSettings({ colorWeak: true })}>
        启用色弱
      </button>
      <button type="button" onClick={() => updateSettings({ colorWeak: false })}>
        关闭色弱
      </button>
    </div>
  );
}
