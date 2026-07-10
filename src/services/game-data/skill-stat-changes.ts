import { apiRequest, type ApiRequest } from '../client';
import { toRequestLongId } from '../identifiers';
import type {
  GameDataListQuery,
  GameDataPage,
  GameDataRecord,
  GameDataResourceService,
} from './shared';

const RESOURCE_PATH = '/api/game-data/skill-stat-changes' as const;

/**
 * 当前资料的独立 API 入口。
 *
 * endpoint 和五个 CRUD 方法都写在当前资源文件中，避免普通页面继续依赖一个能操作所有资料表的通用 service 工厂。
 * request 参数只用于测试注入，生产环境默认走统一的 apiRequest，以便复用令牌、错误归一化和空响应处理。
 */
export function createSkillStatChangesGameDataService(
  request: ApiRequest = apiRequest,
): GameDataResourceService {
  return {
    list: (query: GameDataListQuery) =>
      request<GameDataPage>('GET', RESOURCE_PATH, {
        params: { query },
      }),
    get: (id: string) =>
      request<GameDataRecord>('GET', RESOURCE_PATH + '/{id}', {
        params: { path: { id: toRequestLongId(id) } },
      }),
    create: (payload: Record<string, unknown>) =>
      request<GameDataRecord>('POST', RESOURCE_PATH, {
        body: payload,
      }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<GameDataRecord>('PUT', RESOURCE_PATH + '/{id}', {
        params: { path: { id: toRequestLongId(id) } },
        body: payload,
      }),
    remove: (id: string) =>
      request<void>('DELETE', RESOURCE_PATH + '/{id}', {
        params: { path: { id: toRequestLongId(id) } },
      }),
  };
}

export const skillStatChangesGameDataService = createSkillStatChangesGameDataService();
