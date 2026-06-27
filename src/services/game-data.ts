import { apiRequest, type ApiRequest } from './client';
import type { components } from './generated/schema';
import type { PageQuery } from './system';

export type GameDataRecordResponse = components['schemas']['GameDataRecordResponse'];
export type GameDataRecordRequest = components['schemas']['GameDataRecordRequest'];
export type GameDataPageResponse = components['schemas']['GameDataPageResponse'];

export type GameDataResourceKey =
  | 'abilities'
  | 'creature-abilities'
  | 'creature-elements'
  | 'creature-stats'
  | 'creatures'
  | 'egg-groups'
  | 'elements'
  | 'habitats'
  | 'item-categories'
  | 'items'
  | 'skill-damage-classes'
  | 'skills'
  | 'species'
  | 'species-colors'
  | 'species-egg-groups'
  | 'species-shapes'
  | 'stats';

export interface GameDataRecord {
  id: number;
  fields: Record<string, unknown>;
}

export interface GameDataPage {
  rows: GameDataRecord[];
  totalRowCount: number;
  totalPageCount: number;
  page: number;
  size: number;
}

const resourcePaths: Record<GameDataResourceKey, `/api/game-data/${string}`> = {
  abilities: '/api/game-data/abilities',
  'creature-abilities': '/api/game-data/creature-abilities',
  'creature-elements': '/api/game-data/creature-elements',
  'creature-stats': '/api/game-data/creature-stats',
  creatures: '/api/game-data/creatures',
  'egg-groups': '/api/game-data/egg-groups',
  elements: '/api/game-data/elements',
  habitats: '/api/game-data/habitats',
  'item-categories': '/api/game-data/item-categories',
  items: '/api/game-data/items',
  'skill-damage-classes': '/api/game-data/skill-damage-classes',
  skills: '/api/game-data/skills',
  species: '/api/game-data/species',
  'species-colors': '/api/game-data/species-colors',
  'species-egg-groups': '/api/game-data/species-egg-groups',
  'species-shapes': '/api/game-data/species-shapes',
  stats: '/api/game-data/stats',
};

/**
 * 创建游戏资料 API 集合。
 *
 * 后端按资源暴露独立 Controller；前端在 service 边界用资源白名单拼接路径，避免页面直接拼接
 * 任意 URL。OpenAPI 当前将 fields 推断得很窄，这里统一收敛成页面可用的 Record<string, unknown>。
 */
export function createGameDataServices(request: ApiRequest = apiRequest) {
  return {
    list: async (resource: GameDataResourceKey, query: PageQuery): Promise<GameDataPage> => {
      const page = await request<GameDataPageResponse>('GET', resourcePaths[resource], {
        params: { query },
      });
      return normalizePage(page);
    },
    get: async (resource: GameDataResourceKey, id: number): Promise<GameDataRecord> => {
      const record = await request<GameDataRecordResponse>(
        'GET',
        `${resourcePaths[resource]}/{id}`,
        {
          params: { path: { id } },
        },
      );
      return normalizeRecord(record);
    },
    create: async (
      resource: GameDataResourceKey,
      fields: Record<string, unknown>,
    ): Promise<GameDataRecord> => {
      const record = await request<GameDataRecordResponse>('POST', resourcePaths[resource], {
        body: toRequest(fields),
      });
      return normalizeRecord(record);
    },
    update: async (
      resource: GameDataResourceKey,
      id: number,
      fields: Record<string, unknown>,
    ): Promise<GameDataRecord> => {
      const record = await request<GameDataRecordResponse>(
        'PUT',
        `${resourcePaths[resource]}/{id}`,
        {
          params: { path: { id } },
          body: toRequest(fields),
        },
      );
      return normalizeRecord(record);
    },
    remove: (resource: GameDataResourceKey, id: number) =>
      request<void>('DELETE', `${resourcePaths[resource]}/{id}`, {
        params: { path: { id } },
      }),
  };
}

function normalizePage(page: GameDataPageResponse): GameDataPage {
  return {
    rows: page.rows.map(normalizeRecord),
    totalRowCount: page.totalRowCount,
    totalPageCount: page.totalPageCount,
    page: page.page,
    size: page.size,
  };
}

function normalizeRecord(record: GameDataRecordResponse): GameDataRecord {
  return {
    id: record.id,
    fields: record.fields as Record<string, unknown>,
  };
}

function toRequest(fields: Record<string, unknown>): GameDataRecordRequest {
  return {
    fields: fields as GameDataRecordRequest['fields'],
  };
}

export const gameDataServices = createGameDataServices();
