import type {
  GameDataRecord,
  GameDataResourceKey,
  GameDataResourceService,
} from '../../services/game-data/shared';

export interface GameDataFilters {
  q: string;
}

export type GameDataFormValues = Record<string, unknown>;
export type GameDataFieldFilters = Record<string, string | number | boolean | undefined>;
export type GameDataModalMode = 'create' | 'edit';

export type ReferenceLookupState = {
  records: Map<string, GameDataRecord>;
  loadingKeys: Set<string>;
  errorKeys: Set<string>;
};

export type ReferenceTarget = {
  key: string;
  resource: GameDataResourceKey;
  id: number;
};

export type GameDataReferenceServiceResolver = (
  resource: GameDataResourceKey,
) => GameDataResourceService;
