import { beforeEach, expect, it } from 'vitest';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
  saveTrainerSessionCredential,
} from './trainer-session-storage';

beforeEach(() => {
  sessionStorage.clear();
  clearTrainerSessionCredential();
});

it('keeps the Trainer credential only in runtime memory', () => {
  saveTrainerSessionCredential('opaque-credential');

  expect(readTrainerSessionCredential()).toBe('opaque-credential');
  expect(Object.values(sessionStorage)).not.toContain('opaque-credential');

  clearTrainerSessionCredential();
  expect(readTrainerSessionCredential()).toBeNull();
});
