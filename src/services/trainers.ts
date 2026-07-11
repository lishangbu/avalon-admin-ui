import type { components } from './generated/schema';
import { apiRequest } from './client';

export type Trainer = components['schemas']['TrainerResponse'];
export type CreateTrainerInput = components['schemas']['CreateTrainerRequest'];

export const trainerService = {
  list: () => apiRequest<Trainer[]>('GET', '/api/player/trainers'),
  create: (displayName: string) =>
    apiRequest<Trainer>('POST', '/api/player/trainers', {
      body: { commandId: crypto.randomUUID(), displayName } satisfies CreateTrainerInput,
    }),
  archive: (trainer: Trainer) =>
    apiRequest<Trainer>('POST', '/api/player/trainers/{trainerId}/archive', {
      params: { path: { trainerId: trainer.id } },
      body: { expectedRevision: trainer.revision },
    }),
  restore: (trainer: Trainer) =>
    apiRequest<Trainer>('POST', '/api/player/trainers/{trainerId}/restore', {
      params: { path: { trainerId: trainer.id } },
      body: { expectedRevision: trainer.revision },
    }),
};
