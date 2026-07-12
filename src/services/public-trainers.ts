import type { components } from './generated/schema';
import { apiRequest } from './client';

/** 公开资料契约刻意不包含 Trainer 或 Account 的内部标识。 */
export type PublicTrainerProfile = components['schemas']['PublicTrainerProfile'];

export const publicTrainerService = {
  find: (displayName: string) =>
    apiRequest<PublicTrainerProfile>('GET', '/api/player/public-trainers', {
      params: { query: { displayName } },
      requiresTrainerSession: true,
    }),
};
