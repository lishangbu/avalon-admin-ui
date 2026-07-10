import { apiRequest, type ApiRequest } from '../client';
import { toRequestLongId, type ResponseLongId } from '../identifiers';
import type { PageQuery } from '../system';

export type { ApiRequest } from '../client';

export type GameDataResourceKey = string;
export type GameDataId = ResponseLongId;

export interface GameDataRecord {
  id: GameDataId;
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
  get(id: GameDataId): Promise<GameDataRecord>;
  create(payload: Record<string, unknown>): Promise<GameDataRecord>;
  update(id: GameDataId, payload: Record<string, unknown>): Promise<GameDataRecord>;
  remove(id: GameDataId): Promise<void>;
}

/**
 * 资料引用字段的轻量查询入口。
 *
 * 各维护页面仍然显式导入自己的独立 service；这里仅服务表格中的引用下拉和外键展示。引用字段的目标资源来自
 * 页面配置，运行时才知道具体是哪张资料表，所以不能静态导入某一个资源 service。这里保留的动态 endpoint
 * 只处理外键文本查询，不再作为普通资料页的通用 CRUD 工厂使用。
 */
export function getGameDataReferenceService(
  resource: GameDataResourceKey,
  request: ApiRequest = apiRequest,
): GameDataResourceService {
  const path = `/api/game-data/${resource}` as `/api/game-data/${string}`;

  return {
    list: (query) =>
      request<GameDataPage>('GET', path, {
        params: { query },
      }),
    get: (id) =>
      request<GameDataRecord>('GET', `${path}/{id}`, {
        params: { path: { id: toRequestLongId(id) } },
      }),
    create: (payload) =>
      request<GameDataRecord>('POST', path, {
        body: payload,
      }),
    update: (id, payload) =>
      request<GameDataRecord>('PUT', `${path}/{id}`, {
        params: { path: { id: toRequestLongId(id) } },
        body: payload,
      }),
    remove: (id) =>
      request<void>('DELETE', `${path}/{id}`, {
        params: { path: { id: toRequestLongId(id) } },
      }),
  };
}
