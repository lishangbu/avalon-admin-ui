import { afterEach, expect, it } from 'vitest';
import { clearAccessToken, readAccessToken, saveAccessToken } from './auth-storage';

afterEach(() => {
  sessionStorage.clear();
});

it('stores access token in session storage for the current browser session', () => {
  saveAccessToken('token-value');

  expect(readAccessToken()).toBe('token-value');
});

it('clears access token when the session becomes invalid', () => {
  saveAccessToken('token-value');
  clearAccessToken();

  expect(readAccessToken()).toBeNull();
});
