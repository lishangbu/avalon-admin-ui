import type { GameDataRecord } from '../../services/game-data/shared';
import { toRequestLongId } from '../../services/identifiers';
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
      if (field.type === 'long' && (typeof value === 'string' || typeof value === 'number')) {
        const normalizedValue = typeof value === 'string' ? value.trim() : value;
        return [
          [
            field.name,
            normalizedValue === '' ? null : toRequestLongId(String(normalizedValue)),
          ],
        ];
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

export function normalizeFieldFilters(
  config: GameDataResourceConfig,
  filters: GameDataFieldFilters,
): GameDataFieldFilters {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => !isEmptyFilterValue(value))
      .map(([fieldName, value]) => {
        const field = config.fields.find((candidate) => candidate.name === fieldName);
        if (field?.type === 'long' && (typeof value === 'string' || typeof value === 'number')) {
          return [fieldName, toRequestLongId(String(value))];
        }
        return [fieldName, value];
      }),
  ) as GameDataFieldFilters;
}

export function hasActiveFieldFilters(filters: GameDataFieldFilters): boolean {
  return Object.values(filters).some((value) => !isEmptyFilterValue(value));
}

export function isEmptyFilterValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}
