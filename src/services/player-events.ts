export interface PlayerEvent {
  type:
    | 'AUTHENTICATED'
    | 'HEARTBEAT_ACK'
    | 'CHALLENGE_CHANGED'
    | 'MATCH_CHANGED'
    | 'SESSION_REVOKED';
  resourceId: string | null;
  revision: number | null;
}

export type PlayerConnectionState =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'revoked';

interface PlayerEventSubscriptionOptions {
  getAccessToken: () => string | null;
  trainerCredential: string;
  onEvent: (event: PlayerEvent) => void;
  onReconnect: () => void;
  onStateChange?: (state: PlayerConnectionState) => void;
}

/** WebSocket 只承载失效提示；断线重连后由调用方重新读取全部 REST 权威视图。 */
export function subscribePlayerEvents(options: PlayerEventSubscriptionOptions): () => void {
  let disposed = false;
  let socket: WebSocket | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let reconnect: ReturnType<typeof setTimeout> | undefined;
  let attempt = 0;
  let authenticatedOnce = false;
  let revoked = false;

  // 浏览器离线时主动结束悬挂连接，避免依赖不同内核不一致的 WebSocket close 时机。
  const handleOffline = () => socket?.close();
  window.addEventListener('offline', handleOffline);

  const connect = () => {
    if (disposed) return;
    options.onStateChange?.(authenticatedOnce ? 'reconnecting' : 'connecting');
    socket = new WebSocket(playerEventUrl());
    socket.addEventListener('open', () => {
      const accessToken = options.getAccessToken();
      if (!accessToken) return socket?.close();
      socket?.send(
        JSON.stringify({
          type: 'AUTHENTICATE',
          accessToken,
          trainerCredential: options.trainerCredential,
        }),
      );
    });
    socket.addEventListener('message', (message) => {
      const event = parsePlayerEvent(message.data);
      if (!event) return;
      if (event.type === 'AUTHENTICATED') {
        attempt = 0;
        if (authenticatedOnce) options.onReconnect();
        authenticatedOnce = true;
        options.onStateChange?.('connected');
        if (heartbeat) clearInterval(heartbeat);
        heartbeat = setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'HEARTBEAT' }));
          }
        }, 15_000);
      }
      if (event.type === 'SESSION_REVOKED') {
        revoked = true;
        options.onStateChange?.('revoked');
      }
      options.onEvent(event);
    });
    socket.addEventListener('close', () => {
      if (heartbeat) clearInterval(heartbeat);
      heartbeat = undefined;
      if (disposed || revoked) return;
      options.onStateChange?.('reconnecting');
      reconnect = setTimeout(connect, Math.min(1_000 * 2 ** attempt++, 15_000));
    });
  };

  connect();
  return () => {
    disposed = true;
    if (!revoked) options.onStateChange?.('disconnected');
    if (heartbeat) clearInterval(heartbeat);
    if (reconnect) clearTimeout(reconnect);
    window.removeEventListener('offline', handleOffline);
    socket?.close();
  };
}

function parsePlayerEvent(value: unknown): PlayerEvent | null {
  if (typeof value !== 'string') return null;
  try {
    const event = JSON.parse(value) as Partial<PlayerEvent>;
    return typeof event.type === 'string' ? (event as PlayerEvent) : null;
  } catch {
    return null;
  }
}

function playerEventUrl(): string {
  const configured = import.meta.env.VITE_PLAYER_EVENTS_URL as string | undefined;
  if (configured) {
    if (configured.startsWith('/')) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}${configured}`;
    }
    return configured;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/player/events`;
}
