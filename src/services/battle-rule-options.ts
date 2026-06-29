import { apiRequest, type ApiRequest } from './client';

export interface ReferenceRecord {
  id: number;
  code?: string;
  name?: string;
}

export interface ReferenceOptionPage {
  rows?: ReferenceRecord[];
  totalRowCount?: number;
}

export interface ReferenceOptionQuery {
  page?: number;
  size?: number;
  q?: string;
}

/**
 * 战斗规则页使用的引用资料 API。
 *
 * 这些接口只负责加载下拉选项，正式的规则维护仍走 `battleRulesServices` 的独立资源方法。
 */
export function createBattleRuleOptionServices(request: ApiRequest = apiRequest) {
  return {
    creatures: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/creatures', {
        params: { query },
      }),
    skills: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/skills', {
        params: { query },
      }),
    elements: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/elements', {
        params: { query },
      }),
    abilities: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/abilities', {
        params: { query },
      }),
    items: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/items', {
        params: { query },
      }),
    stats: (query: ReferenceOptionQuery) =>
      request<ReferenceOptionPage>('GET', '/api/game-data/stats', {
        params: { query },
      }),
  };
}

export const battleRuleOptionServices = createBattleRuleOptionServices();
