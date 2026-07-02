import { apiRequest, type ApiRequest } from './client';

export interface ReferenceRecord {
  id: number;
  code?: string;
  name?: string;
}

export interface ReferenceOptionPage {
  rows?: ReferenceRecord[];
  totalRowCount?: number;
  totalPageCount?: number;
  page?: number;
  size?: number;
}

export interface ReferenceOptionQuery {
  page?: number;
  size?: number;
  q?: string;
}

const backendPageSizeLimit = 100;

/**
 * 加载战斗规则页的引用选项。
 *
 * 战斗规则页面需要把技能、道具等资料一次性转成可读文案，但后端分页接口为了保护普通表格查询，
 * 将单次 `size` 限制在 100 以内。这里保留页面层“想要最多 N 条引用资料”的语义，然后在服务层
 * 自动拆成多个 100 条分页请求；这样表格渲染、下拉框和规则选项都只面对一个合并后的 page，
 * 不需要在每个页面重复处理分页上限，也不会再因为 `size=5000` 被后端校验拒绝。
 */
async function loadReferenceOptions(
  request: ApiRequest,
  path: `/api/game-data/${string}`,
  query: ReferenceOptionQuery,
): Promise<ReferenceOptionPage> {
  const requestedSize = query.size ?? backendPageSizeLimit;
  if (requestedSize <= backendPageSizeLimit) {
    return request<ReferenceOptionPage>('GET', path, {
      params: { query },
    });
  }

  const firstPage = query.page ?? 0;
  const rows: ReferenceRecord[] = [];
  let page = firstPage;
  let totalRowCount: number | undefined;
  let totalPageCount: number | undefined;

  while (rows.length < requestedSize) {
    const currentQuery = { ...query, page, size: backendPageSizeLimit };
    const currentPage = await request<ReferenceOptionPage>('GET', path, {
      params: { query: currentQuery },
    });
    const currentRows = currentPage.rows ?? [];

    rows.push(...currentRows);
    totalRowCount = currentPage.totalRowCount ?? totalRowCount;
    totalPageCount = currentPage.totalPageCount ?? totalPageCount;

    const reachedServerEnd = totalPageCount !== undefined && page + 1 >= totalPageCount;
    const reachedShortPage = currentRows.length < backendPageSizeLimit;
    if (reachedServerEnd || reachedShortPage) {
      break;
    }

    page += 1;
  }

  return {
    rows: rows.slice(0, requestedSize),
    totalRowCount: totalRowCount ?? rows.length,
    totalPageCount,
    page: firstPage,
    size: requestedSize,
  };
}

/**
 * 战斗规则页使用的引用资料 API。
 *
 * 这些接口只负责加载下拉选项，正式的规则维护仍走 `battleRulesServices` 的独立资源方法。
 */
export function createBattleRuleOptionServices(request: ApiRequest = apiRequest) {
  return {
    creatures: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/creatures', query),
    skills: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/skills', query),
    elements: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/elements', query),
    abilities: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/abilities', query),
    items: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/items', query),
    stats: (query: ReferenceOptionQuery) =>
      loadReferenceOptions(request, '/api/game-data/stats', query),
  };
}

export const battleRuleOptionServices = createBattleRuleOptionServices();
