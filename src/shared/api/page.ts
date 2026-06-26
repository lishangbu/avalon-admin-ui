export interface JimmerPage<T> {
  rows: T[];
  totalRowCount: number;
}

export interface ProTableResult<T> {
  data: T[];
  success: boolean;
  total: number;
}

export interface ProTablePageParams {
  current?: number;
  pageSize?: number;
}

export interface BackendPageParams {
  page: number;
  size: number;
}

/**
 * 将后端 Jimmer Page 转成 ProTable request 期望的数据结构。
 *
 * 这一层集中处理字段差异，页面只关心表格数据和总数，避免每个页面重复转换。
 */
export function toProTableResult<T>(page: JimmerPage<T>): ProTableResult<T> {
  return {
    data: page.rows,
    success: true,
    total: page.totalRowCount,
  };
}

/**
 * 将 ProTable 的 1-based 页码转换成后端约定的 0-based page。
 *
 * 后端限制 size 最大为 100，这里做一次上限收敛，避免页面传入过大分页导致 400。
 */
export function toBackendPage(params: ProTablePageParams): BackendPageParams {
  const current = Math.max(params.current ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 20, 1), 100);
  return {
    page: current - 1,
    size: pageSize,
  };
}
