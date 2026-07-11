import { afterEach, expect, it } from 'vitest';
import {
  clearAccessToken,
  readAccessToken,
  readRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from './auth-storage';

afterEach(() => {
  sessionStorage.clear();
});

it('keeps refresh token in the current tab session and clears it with logout', () => {
  saveRefreshToken('refresh-token');
  expect(readRefreshToken()).toBe('refresh-token');
  clearAccessToken();
  expect(readRefreshToken()).toBeNull();
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
