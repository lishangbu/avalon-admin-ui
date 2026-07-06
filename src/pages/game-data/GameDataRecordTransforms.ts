import type { GameDataRecord } from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';
import type { GameDataFieldFilters, GameDataFormValues } from './GameDataPageTypes';

export function createInitialValues(config: GameDataResourceConfig): GameDataFormValues {
  return Object.fromEntries(
    config.fields.map((field) => [
      field.name,
      field.defaultValue ?? (field.type === 'string' ? '' : undefined),
    ]),
  );
}

export function toRecordFields(
  config: GameDataResourceConfig,
  values: GameDataFormValues,
): Record<string, unknown> {
  return Object.fromEntries(
    config.fields.flatMap((field) => {
      const value = values[field.name];
      if (value === undefined) {
        return [[field.name, null]];
      }
      if (typeof value === 'string') {
        const text = value.trim();
        return [[field.name, text || null]];
      }
      return [[field.name, value]];
    }),
  );
}

export function toFormValues(
  config: GameDataResourceConfig,
  record: GameDataRecord,
): GameDataFormValues {
  return Object.fromEntries(config.fields.map((field) => [field.name, record[field.name]]));
}

export function normalizeFieldFilters(filters: GameDataFieldFilters): GameDataFieldFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => !isEmptyFilterValue(value)),
  ) as GameDataFieldFilters;
}

export function hasActiveFieldFilters(filters: GameDataFieldFilters): boolean {
  return Object.values(filters).some((value) => !isEmptyFilterValue(value));
}

export function isEmptyFilterValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}
