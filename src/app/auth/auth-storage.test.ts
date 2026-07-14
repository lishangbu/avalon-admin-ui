import { afterEach, expect, it } from 'vitest';
import { clearAccessToken, readAccessToken, saveAccessToken } from './auth-storage';

afterEach(() => sessionStorage.clear());

it('stores and clears the sa token in the current browser session', () => {
  saveAccessToken('token-value');
  expect(readAccessToken()).toBe('token-value');

  clearAccessToken();
  expect(readAccessToken()).toBeNull();
});
