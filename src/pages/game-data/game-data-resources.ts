import type { GameDataResourceKey } from '../../services/game-data/shared';

export type GameDataFieldType = 'string' | 'int' | 'long' | 'boolean';

export interface GameDataReferenceConfig {
  resource: GameDataResourceKey;
  labelField?: string;
  codeField?: string;
  displayFields?: string[];
}

export interface GameDataFieldConfig {
  name: string;
  label: string;
  type: GameDataFieldType;
  required?: boolean;
  maxLength?: number;
  width?: number;
  defaultValue?: unknown;
  reference?: GameDataReferenceConfig;
  filter?: boolean;
}

export interface GameDataResourceConfig {
  key: GameDataResourceKey;
  path: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  displayFields?: string[];
  fields: GameDataFieldConfig[];
}
