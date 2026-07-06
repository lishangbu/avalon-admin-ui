import { apiRequest, type ApiRequest } from '../client';
import type { PageQuery } from '../system';

export type { ApiRequest } from '../client';

export type GameDataResourceKey = string;

export interface GameDataRecord {
  id: number;
  [key: string]: unknown;
}

export interface GameDataPage {
  rows: GameDataRecord[];
  totalRowCount: number;
  totalPageCount: number;
  page: number;
  size: number;
}

export interface GameDataListQuery extends PageQuery {
  [key: string]: string | number | boolean | undefined;
}

export interface GameDataResourceService {
  list(query: GameDataListQuery): Promise<GameDataPage>;
  get(id: number): Promise<GameDataRecord>;
  create(payload: Record<string, unknown>): Promise<GameDataRecord>;
  update(id: number, payload: Record<string, unknown>): Promise<GameDataRecord>;
  remove(id: number): Promise<void>;
}

export function createGameDataResourceService(
  path: `/api/game-data/${string}`,
  request: ApiRequest = apiRequest,
): GameDataResourceService {
  return {
    list: async (query) => {
      return request<GameDataPage>('GET', path, {
        params: { query },
      });
    },
    get: (id) =>
      request<GameDataRecord>('GET', `${path}/{id}`, {
        params: { path: { id } },
      }),
    create: async (payload) => {
      return request<GameDataRecord>('POST', path, {
        body: payload,
      });
    },
    update: async (id, payload) => {
      return request<GameDataRecord>('PUT', `${path}/{id}`, {
        params: { path: { id } },
        body: payload,
      });
    },
    remove: (id) =>
      request<void>('DELETE', `${path}/{id}`, {
        params: { path: { id } },
      }),
  };
}

/**
 * 资料引用字段的轻量查询入口。
 *
 * 各维护页面仍然显式导入自己的独立 service；这里仅服务表格中的引用下拉和外键展示。引用查询只需要标准
 * `/api/game-data/{resource}` CRUD 形态，如果继续通过 barrel 静态导入所有 service，通用表格 chunk 会被迫携带
 * 80 多个页面专属入口。
 */
export function getGameDataReferenceService(
  resource: GameDataResourceKey,
  request: ApiRequest = apiRequest,
): GameDataResourceService {
  return createGameDataResourceService(
    `/api/game-data/${resource}` as `/api/game-data/${string}`,
    request,
  );
}
