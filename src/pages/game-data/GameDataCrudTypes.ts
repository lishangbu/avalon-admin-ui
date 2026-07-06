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

export interface GameDataRecordTableProps {
  rows: GameDataRecord[];
  totalRowCount: number;
  page: { current: number; pageSize: number };
  loading: boolean;
  error: unknown;
  referenceLookup: ReferenceLookupState;
  onPageChange: (current: number, pageSize: number) => void;
  onDetail: (record: GameDataRecord) => void;
  onEdit: (record: GameDataRecord) => void;
  onDelete: (record: GameDataRecord) => void;
}

export type ReferenceTarget = {
  key: string;
  resource: GameDataResourceKey;
  id: number;
};

export type GameDataReferenceServiceResolver = (
  resource: GameDataResourceKey,
) => GameDataResourceService;
