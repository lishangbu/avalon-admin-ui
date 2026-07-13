import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { subscribePlayerEvents } from './player-events';

class FakeWebSocket {
  static readonly OPEN = 1;
  static instances: FakeWebSocket[] = [];
  readonly sent: string[] = [];
  readyState = FakeWebSocket.OPEN;
  private readonly listeners = new Map<string, Array<(event: { data?: string }) => void>>();

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: (event: { data?: string }) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(value: string) {
    this.sent.push(value);
  }

  close() {
    this.emit('close');
  }

  emit(type: string, data?: string) {
    this.listeners.get(type)?.forEach((listener) => listener({ data }));
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeWebSocket.instances = [];
  vi.stubGlobal('WebSocket', FakeWebSocket);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('authenticates, heartbeats and refreshes authoritative state after reconnect', () => {
  const onEvent = vi.fn();
  const onReconnect = vi.fn();
  const unsubscribe = subscribePlayerEvents({
    getAccessToken: () => 'access-token',
    trainerCredential: 'trainer-token',
    onEvent,
    onReconnect,
  });
  const first = FakeWebSocket.instances[0]!;

  first.emit('open');
  expect(first.sent[0]).toContain('access-token');
  first.emit(
    'message',
    JSON.stringify({ type: 'AUTHENTICATED', resourceId: '11', revision: null }),
  );
  vi.advanceTimersByTime(15_000);
  expect(first.sent.at(-1)).toBe(JSON.stringify({ type: 'HEARTBEAT' }));

  first.emit('close');
  vi.advanceTimersByTime(1_000);
  const second = FakeWebSocket.instances[1]!;
  second.emit('open');
  second.emit(
    'message',
    JSON.stringify({ type: 'AUTHENTICATED', resourceId: '11', revision: null }),
  );

  expect(onReconnect).toHaveBeenCalledOnce();
  expect(onEvent).toHaveBeenCalledTimes(2);
  unsubscribe();
});
